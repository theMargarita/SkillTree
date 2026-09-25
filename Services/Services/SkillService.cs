using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos.SKills;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services.IServices;

namespace Services.Services
{
    public class SkillService : ISkillService
    {
        private readonly ILogger<SkillService> _logger;
        private readonly SkillDbContext _ctx;
        public SkillService(SkillDbContext ctx, ILogger<SkillService> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public async Task<SkillResponse> Create(SkillRequest request)
        {
            if (request.SkillBoardId == Guid.Empty)
            {
                _logger.LogWarning("Skill create called with empty SkillBoardId");
                throw new ArgumentException("SkillBoardId must be provided", nameof(request.SkillBoardId));
            }

            var boardExists = await _ctx.SkillBoard.AnyAsync(b => b.Id == request.SkillBoardId);
            if (!boardExists)
            {
                _logger.LogWarning($"Skill create called with non-existent SkillBoardId: {request.SkillBoardId}");
                throw new KeyNotFoundException($"SkillBoard not found: {request.SkillBoardId}");
            }

            var create = new Skills
            {
                SkillBoardId = request.SkillBoardId,
                Name = request.Name,
                Description = request.Description,
                RequiredSubSkillCount = request.RequiredSubSkillCount,
                Color = request.Color,
                Icon = request.Icon,
                PositionX = request.PositionX,
                PositionY = request.PositionY,
                Shape = request.Shape,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            _ctx.Skills.Add(create);
            await _ctx.SaveChangesAsync();

            _logger.LogInformation($"Created Skill {create.Id} on Board {create.SkillBoardId}");

            return SkillResponse.FromSkill(create);
        }

        public async Task<bool> Delete(Guid id)
        {
            var skillId = await _ctx.Skills.FindAsync(id);

            if (skillId == null)
            {
                _logger.LogError($"Could not find the given tree id {id}");
                return false;
            }

            _ctx.Skills.Remove(skillId);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Skill now removed with ID: {id}");
            return true;
        }

        public async Task<List<SkillResponse>> GetAllSkillsAsync()
        {
            var getSkills = _ctx.Skills;
            return await getSkills.Select(s => SkillResponse.FromSkill(s, 0)).ToListAsync(); //added the zero for now just to remove the error 
        }


        public async Task<SkillResponse> GetSkillTreeById(Guid id)
        {
            if (id == Guid.Empty)
            {
                _logger.LogWarning("GetSkillTreeById was called with Guid.Empty");
                throw new ArgumentException("id cannot be empty", nameof(id));
            }

            var skill = await _ctx.Skills.FindAsync(id);
            if (skill == null)
            {
                _logger.LogError($"Could not find skill with id {id}");
                throw new KeyNotFoundException($"Could not find the skill id: {id}");
            }
     
            return SkillResponse.FromSkill(skill);
        }

        public async Task<SkillResponse> Update(Guid id, SkillRequest request)
        {
            var skillId = await _ctx.Skills.FindAsync(id);

            if (skillId == null) 
            {
                _logger.LogError($"Could not find the given tree id to update: {id}");
                throw new KeyNotFoundException($"Could not find the skill id: {id}");
            }

            skillId.Name = request.Name;
            skillId.Description = request.Description;
            skillId.Color = request.Color;
            skillId.Icon = request.Icon;
            skillId.UpdatedAt = DateTimeOffset.UtcNow;
            skillId.RequiredSubSkillCount = request.RequiredSubSkillCount;

            _ctx.Skills.Update(skillId);
            await _ctx.SaveChangesAsync();
            return SkillResponse.FromSkill(skillId);
        }
    }
}
