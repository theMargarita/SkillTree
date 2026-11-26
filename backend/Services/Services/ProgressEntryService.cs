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
                //Type = request.Type,
                //ImageUrl = request.ImageUrl,
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

        public async Task<bool> Remove(Guid id)
        {
           var remove = await _ctx.ProgressEntries.FindAsync(id);
           if(remove == null)
            {
                _logger.LogWarning($"Could not find entry id: {id}");
                throw new KeyNotFoundException(nameof(id));
            }

            _ctx.Remove(remove);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Entry now deleted, id: {id}");
            return true;
        }

        public async Task<ProgressEntryResponse> Update(Guid id, ProgressEntryRequest request)
        {
            var entry = await _ctx.ProgressEntries.GetById(id).FirstOrDefaultAsync();
            if(entry == null)
            {
                throw new KeyNotFoundException(nameof(id));
            }

            //entry.ImageUrl = request.ImageUrl;
            entry.ContentText = request.ContentText; 
            // entry.VideoUrl = request.VideoUrl;
            entry.UpdatedAt = request.UpdatedAt; //i know this is not currect but let have it like this for now 

            await _ctx.SaveChangesAsync();
            return ProgressEntryResponse.FromEntry(entry);
        }
    }
}
