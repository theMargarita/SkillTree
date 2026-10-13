using Domain;
using Infrastructure.Data;
using Infrastructure.Dto;
using Infrastructure.Dtos.ProgressEntry;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services.IServices;

namespace Services.Services
{
    public class ProgressEntryService : IProgressEntryService
    {
        private readonly SkillDbContext _ctx;
        private readonly ILogger<ProgressEntryService> _logger;

        public ProgressEntryService(SkillDbContext ctx, ILogger<ProgressEntryService> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public async Task<ProgressEntryResponse> Create(ProgressEntryRequest request)
        {
            var subSkillExists = await _ctx.SubSkills.AnyAsync(s => s.Id == request.SubSkillId);
            if (!subSkillExists)
            {
                _logger.LogWarning($"ProgressEntry create called with non-existent SubSkillId: {request.SubSkillId}");
                throw new KeyNotFoundException($"SubSkill not found: {request.SubSkillId}");
            }

            var entry = new ProgressEntries
            {
                SubSkillId = request.SubSkillId,
                Type = request.Type,
                ImageUrl = request.ImageUrl,
                ContentText = request.ContentText,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            _ctx.ProgressEntries.Add(entry);
            await _ctx.SaveChangesAsync();

            _logger.LogInformation($"Progress entry created: {entry.Id} for subskill {entry.SubSkillId}");
            return ProgressEntryResponse.FromEntry(entry);
        }

        public async Task<List<ProgressEntryResponse>> GetAllBySubSkill(Guid subSkillId)
        {
            var entries = await _ctx.ProgressEntries
                .GetAllBySubSkillId(subSkillId)
                .ToListAsync();

            return entries.Select(ProgressEntryResponse.FromEntry).ToList();
        }
    }
}
