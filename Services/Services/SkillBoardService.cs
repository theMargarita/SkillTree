using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos;
using Infrastructure.Dtos.SkillBoard;
using Infrastructure.Dtos.SkillBoards;
using Infrastructure.Dtos.SKills;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services.IServices;
using static Infrastructure.Dtos.ProgressEntry.StatusEnum;

namespace Services.Services
{
    public class SkillBoardService : ISkillBoardService
    {
        private readonly SkillDbContext _ctx;
        private readonly ILogger<SkillBoardService> _logger;
        private readonly IStatusService _statusService;

        public SkillBoardService(SkillDbContext ctx, ILogger<SkillBoardService> logger, IStatusService statusService)
        {
            _ctx = ctx;
            _logger = logger;
            _statusService = statusService;
        }

        public async Task<SkillBoardResponse> Create(Guid userId, SkillBoardRequest request)
        {
            var board = new SkillBoard
            {
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                BackgroundColor = request.BackgroundColor,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow,
            };

            _ctx.SkillBoard.Add(board);
            await _ctx.SaveChangesAsync();

            _logger.LogInformation($"Board created: {board.Id}");
            return SkillBoardResponse.FromBoard(board, 0);
        }


        public async Task<bool> Delete(Guid id)
        {
            var board = await _ctx.SkillBoard.GetTreeById(id).FirstOrDefaultAsync();
            if (board == null)
            {
                return false;
            }

            _ctx.SkillBoard.Remove(board);
            await _ctx.SaveChangesAsync();
            return true;
        }

        public async Task<List<SkillBoardResponse>> GetAllForUser(Guid userId)
        {
            var boards = await _ctx.SkillBoard
                .GetAllUserSkillTrees(userId)
                .ToListAsync();

            if (boards.Count == 0)
            {
                return new List<SkillBoardResponse>();
            }

            var boardIds = boards.Select(b => b.Id).ToList();

            // one grouped count query for all boards, instead of one Count() per board
            var skillCounts = await _ctx.Skills
                .Where(s => boardIds.Contains(s.SkillBoardId))
                .GroupBy(s => s.SkillBoardId)
                .Select(g => new { BoardId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.BoardId, g => g.Count);

            return boards
                .Select(b => SkillBoardResponse.FromBoard(b, skillCounts.GetValueOrDefault(b.Id, 0)))
                .ToList();
        }
       

        public async Task<SkillBoardDetailResponse> GetBoardDetail(Guid id)
        {
            var board = await _ctx.SkillBoard.GetTreeById(id).FirstOrDefaultAsync();
            if (board == null)
            {
                throw new KeyNotFoundException($"Board {id} not found");
            }

            var skills = await _ctx.Skills
                .GetAllByBoardId(id)
                .ToListAsync();

            var connections = await _ctx.SkillConnections
                .GetAllByBoardId(id)
                .ToListAsync();

            var skillIds = skills.Select(s => s.Id).ToList();

            // one grouped query for every skill's completed-subskill count -
            // this is the N+1 avoidance from SubSkillExtension.GetCompletedCountsBySkillIds
            var completionCounts = await _ctx.SubSkills
                .GetCompletedCountsBySkillIds(skillIds)
                .ToDictionaryAsync(c => c.SkillId, c => c.CompletedCount);

            // Pure in-memory computation - no extra queries, uses what's already loaded.
            var statuses = _statusService.ComputeStatuses(skills, connections, completionCounts);

            var skillResponses = skills
                .Select(s => SkillResponse.FromSkillWithStatus(
                    s,
                    completionCounts.GetValueOrDefault(s.Id, 0),
                    statuses.GetValueOrDefault(s.Id, SkillStatus.Unlocked)))
                .ToList();

            var connectionResponses = connections
                .Select(SkillConnectionResponse.FromConnection)
                .ToList();

            return SkillBoardDetailResponse.Compose(board, skillResponses, connectionResponses);
        }

        public async Task<SkillBoardResponse> Update(Guid id, SkillBoardRequest request)
        {
            var board = await _ctx.SkillBoard.GetTreeById(id).FirstOrDefaultAsync();
            if (board == null)
            {
                throw new KeyNotFoundException($"Board {id} not found");
            }

            board.Name = request.Name;
            board.Description = request.Description;
            board.BackgroundColor = request.BackgroundColor;
            board.UpdatedAt = DateTimeOffset.UtcNow;

            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Board now updated with id: {id}");
            return SkillBoardResponse.FromBoard(board, 0);
        }
    }
}