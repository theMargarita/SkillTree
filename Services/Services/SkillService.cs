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
        private readonly IServiceProvider _serviceProvider; //??
        private readonly SkillDbContext _ctx;
        public SkillService(SkillDbContext ctx, ILogger<SkillService> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public async Task<SkillResponse> Create(SkillRequest request)
        {
            var create = new Skills
            {
                Name = request.Name,
                Description = request.Description,
                RequiredSubSkillCount = request.RequiredSubSkillCount,
                Color = request.Color,
                Icon = request.Icon,
                CreatedAt = DateTime.UtcNow
            };

            _ctx.Skills.Add(create);
            await _ctx.SaveChangesAsync();

            return SkillResponse.FromSkill(create);
        }

        public async Task<bool> Delete(Guid id)
        {
            var skillId = await _ctx.Skills.FindAsync(id);

            if (skillId == null)
            {
                _logger.LogError($"Could find the given tree id {id}");
                return false;
            }

            _ctx.Skills.Remove(skillId);
            await _ctx.SaveChangesAsync();
            Console.WriteLine("Tree now removed!");
            return true;
        }

        public async Task<List<SkillResponse>> GetAllSkillsAsync()
        {
            var getSkills = _ctx.Skills;
            return await getSkills.Select(s => SkillResponse.FromSkill(s)).ToListAsync();
        }

        public Task<List<SkillResponse>> GetAllSkillsAsync(SkillRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<SkillResponse> GetSkillTreeById(Guid id)
        {
            var skill = await _ctx.Skills.FindAsync(id);
            if (skill == null)
            {
                _logger.LogError($"Could not find tree id {id} to update");
                return null;
            }
     
            return SkillResponse.FromSkill(skill);
        }

        public async Task<SkillResponse> Update(Guid id, SkillRequest request)
        {
            var skillId = await _ctx.Skills.FindAsync(id);

            if (skillId == null) 
            {
                _logger.LogError($"Could not find the givien tree id to update: {id}");
            }

            var update = new Skills
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                Color = request.Color,
                Icon = request.Icon,
                UpdatedAt = DateTime.UtcNow,
                RequiredSubSkillCount = request.RequiredSubSkillCount,
            };

            _ctx.Skills.Update(update);
            await _ctx.SaveChangesAsync();
            return SkillResponse.FromSkill(update);
        }
    }
}
