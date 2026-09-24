using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos;
using Infrastructure.Dtos.SkillConnection;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services.IServices;

namespace Services.Services
{
    public class SkillConnectionService : ISkillConnectionService
    {
        private readonly ILogger<SkillConnectionService> _logger;
        private readonly SkillDbContext _ctx;

        public SkillConnectionService(ILogger<SkillConnectionService> logger, SkillDbContext ctx)
        {
            _logger = logger;
            _ctx = ctx;
        }

        public async Task<SkillConnectionResponse> Create(SkillConnectionRequest request)
        {
            if (request.FromSkillId == request.ToSkillId)
            {
                throw new InvalidOperationException("A skill cannot connect to itself");
            }

            var fromId = await _ctx.Skills.GetById(request.FromSkillId).FirstOrDefaultAsync();

            var toId = await _ctx.Skills.GetById(request.ToSkillId).FirstOrDefaultAsync();

            if (fromId == null || toId == null)
            {
                throw new InvalidOperationException("One or both skills were not found");
            }

            if (fromId.SkillBoardId != request.SkillBoardId || toId.SkillBoardId != request.SkillBoardId)
            {
                throw new InvalidOperationException("Both skills must belong to the given board");
            }

            var duplicate = await _ctx.SkillConnections
                .WhereConnects(request.FromSkillId, request.ToSkillId)
                .AnyAsync();

            if (duplicate) 
            {
                throw new InvalidOperationException("A connection between these skills already exxists");
            }

            if (await CreatesCycle(request.FromSkillId, request.ToSkillId))
            {
                throw new InvalidOperationException("This connection would connection a cycle"); 
            }

            var connection = new SkillConnections
            {
                SkillBoardId = request.SkillBoardId,
                FromSkillId = request.FromSkillId,
                ToSkillId = request.ToSkillId,
                LineColor = request.LineColor,
                LineStyle = request.LineStyle,
            };

            _ctx.SkillConnections.Add(connection);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Connection created: {connection.FromSkillId} -> {connection.ToSkillId}");
            return SkillConnectionResponse.FromConnection(connection);
        }

        public async Task<bool> Delete(Guid id)
        {
            var connection = await _ctx.SkillConnections.FindAsync(id);
            if (connection == null)
            {
                _logger.LogWarning($"Could not find the connection id: {id}");
                throw new KeyNotFoundException();
                //return false;
            }

            _ctx.SkillConnections.Remove(connection);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"The connection id {id} is now removed");
            return true;
        }

        private async Task<bool> CreatesCycle(Guid fromId, Guid toId)
        {
            var visited = new HashSet<Guid> { toId };
            var frontier = new Queue<Guid>();
            frontier.Enqueue(toId);

            while (frontier.Count > 0)
            {
                var current = frontier.Dequeue();

                if (current == fromId)
                {
                    return true;
                }

                var next = await _ctx.SkillConnections
                    .GetOutgoingBySkillId(current)
                    .Select(c => c.ToSkillId)
                    .ToListAsync();

                foreach (var id in next)
                {
                    if (visited.Add(id))
                    {
                        frontier.Enqueue(id);
                    }
                }
            }

            return false;
        }
    }
}
