using Infrastructure.Dto;
using Infrastructure.Dtos.ProgressEntry;

namespace Services.IServices
{
    public interface IProgressEntryService
    {
        Task<ProgressEntryResponse> Create(ProgressEntryRequest request);
        Task<List<ProgressEntryResponse>> GetAllBySubSkill(Guid subSkillId);
    }
}
