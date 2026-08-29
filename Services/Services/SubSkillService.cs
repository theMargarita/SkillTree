using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos.SubSkill;
using Microsoft.Extensions.Logging;
using Services.IServices;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Services.Services
{
    public class SubSkillService : ISubSkillService
    {
        private readonly ILogger<SubSkillService> _logger;
        private readonly SkillDbContext _ctx;

        public SubSkillService(ILogger<SubSkillService> logger, SkillDbContext ctx)
        {
            _logger = logger;
            _ctx = ctx;
        }

        public async Task<SubSkillResponse> Create(SubSkillRequest request)
        {
            var sub = new SubSkills
            {
                Name = request.Name,
                Description = request.Description,
                ProgressText = request.ProgressText,
                Color = request.Color,
                OrderIndex = request.OrderIndex,
                ProgressURL = request.ProgressURL,
                IsComplete = request.IsComplete,
                CompletedAt = request.IsComplete ? DateTimeOffset.UtcNow : null,
            };

            _ctx.Add(sub);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Sub skills is now created with ID: {sub.Id}");
            return SubSkillResponse.FromSubSkill(sub);
        }

        public async Task<bool> Delete(Guid subskillId)
        {
            var remove = await _ctx.SubSkills.FindAsync(subskillId);
            if (remove == null)
            {
                _logger.LogWarning($"Could not find the given id: {subskillId}");
                throw new KeyNotFoundException(nameof(subskillId));
            }

            _ctx.Remove(remove);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Deleted {subskillId}");
            return true;
        }

        public async Task<List<SubSkillResponse>> GetAllBySkill(Guid skillId)
        {
            var getAll = await _ctx.SubSkills
                .GetAllBySkillId(skillId)
                .ToListAsync();

            return getAll.Select(SubSkillResponse.FromSubSkill).ToList();
        }

        public async Task<List<SubSkillResponse>> GetCompleted(Guid skillId)
        {
            var list = await _ctx.SubSkills
                .GetCompletedBySkillId(skillId)
                .ToListAsync();

            return list.Select(SubSkillResponse.FromSubSkill).ToList();
        }

        public async Task<List<SubSkillResponse>> GetWithProgress(Guid subskillId)
        {
            var subskill = await _ctx.SubSkills
                .GetByIdWithProgressEntries(subskillId)
                .FirstOrDefaultAsync();

            if (subskill == null)
            {
                throw new KeyNotFoundException(nameof(subskillId));
            }

            //because dto return a response in iqueryable and not list 
            return new List<SubSkillResponse>{SubSkillResponse.FromSubSkill(subskill)};
        }

        public async Task<bool> MarkAsComplete(Guid subskillId)
        {
            var subskill = await _ctx.SubSkills
                .GetById(subskillId)
                .FirstOrDefaultAsync();

            if (subskill == null)
            {
                _logger.LogWarning($"Could not find the givien id: {subskillId}");
                return false;
            }

            subskill.IsComplete = true;
            subskill.CompletedAt = DateTimeOffset.UtcNow;

            await _ctx.SaveChangesAsync();

            _logger.LogInformation("Sub skill now complete and saved, good job");
            return true;
        }

        public async Task<bool> MarkAsIncomplete(Guid subskillId)
        {
            var subskill = await _ctx.SubSkills
                .GetById(subskillId)
                .FirstOrDefaultAsync();

            if (subskill == null)
            {
                _logger.LogWarning($"Could not find the givien id: {subskillId}");
                return false;
            }

            subskill.IsComplete = false;
            subskill.CompletedAt = new DateTimeOffset(DateTime.UtcNow);

            await _ctx.SaveChangesAsync();
            return true;
        }

        public async Task<SubSkillResponse> Update(SubSkillRequest request, Guid subskillId)
        {
            var subskill = await _ctx.SubSkills
                .GetById(subskillId)
                .FirstOrDefaultAsync();

            if(subskill == null)
            {
                throw new KeyNotFoundException(nameof(subskillId));
            }

            subskill.Description = request.Description;
            subskill.ProgressText = request.ProgressText;
            subskill.Color = request.Color;
            subskill.OrderIndex = request.OrderIndex;
            subskill.ProgressURL = request.ProgressURL;

            await _ctx.SaveChangesAsync();
            return SubSkillResponse.FromSubSkill(subskill);
        }
    }
}
