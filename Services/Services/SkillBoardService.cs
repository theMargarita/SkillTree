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

namespace Services.Services
{
    public class SkillBoardService : ISkillBoardService
    {
        private readonly SkillDbContext _ctx;
        private readonly ILogger<SkillBoardService> _logger;
        public SkillBoardService(SkillDbContext ctx, ILogger<SkillBoardService> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }
        public async Task<SkillBoardResponse> Create(Guid userId, SkillBoardRequest request)
        {
            var addBoard = new SkillBoard
            {
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                BackgroundColor = request.BackgroundColor,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _ctx.AddAsync(addBoard);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation("Board is now created");
            return SkillBoardResponse.FromBoard(addBoard, 0);
        }

        public async Task<bool> Delete(Guid id)
        {
            var board = _ctx.SkillBoard.GetTreeById(id);
            if (board == null) 
            {
                _logger.LogWarning($"Could not find id: {id}");
                //return new KeyNotFoundException($"Could not find id: {id}"); 
                return false;
            }

             _ctx.Remove(board);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Successeded to remove board with the given id: {id}");
            return true;
        }

        public async Task<List<SkillBoardResponse>> GetAllForUser(Guid userId)
        {
            var boards = await _ctx.SkillBoard.GetAllUserSkillTrees(userId).ToListAsync();

            if(boards.Count == 0)
            {
                return new List<SkillBoardResponse>();
            }

            var boardsId = boards.Select(x => x.Id).ToList();

            // one grouped count query for all boards, instead of one Count() per board
            var skillcounts = await _ctx.Skills
                .Where(s => boardsId.Contains(s.SkillBoardId))
                .GroupBy(s => s.SkillBoardId)
                .Select(g => new {BoardId = g.Key, Count = g.Count()})
                .ToDictionaryAsync(g => g.BoardId, g => g.Count);

            return boards
                .Select(b => SkillBoardResponse.FromBoard(b, skillcounts.GetValueOrDefault(b.Id, 0))).ToList();
        }

        public async Task<SkillBoardDetailResponse> GetBoardDetail(Guid id)
        {
            var board = await _ctx.SkillBoard.GetTreeById(id).FirstOrDefaultAsync();

            if(board == null)
            {
                throw new KeyNotFoundException($"Board {id} not found");
            }

            var skills = await _ctx.Skills.GetAllByBoardId(id).ToListAsync();

            var connections = await _ctx.SkillConnections.GetAllByBoardId(id).ToListAsync();

            var skillIds = skills.Select(x => x.Id).ToList();


            // one grouped query for every skill's completed-subskill count -
            // this is the N+1 avoidance from SubSkillExtension.GetCompletedCountsBySkillIds
            var completionsCounts = await _ctx.SubSkills.GetCompletedCountsBySkillIds(skillIds)
                .ToDictionaryAsync(c => c.SkillId, c => c.CompletedCount);

            var skillResponses = skills.Select(s => SkillResponse.FromSkill(s, completionsCounts.GetValueOrDefault(s.Id, 0))).ToList();

            var connectionResponsses = connections
                .Select(SkillConnectionResponse.FromConnection)
                .ToList();

            return SkillBoardDetailResponse.Compose(board, skillResponses, connectionResponsses);
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
