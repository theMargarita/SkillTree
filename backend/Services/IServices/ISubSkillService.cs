using Infrastructure.Dtos.SubSkill;

namespace Services.IServices
{
    public interface ISubSkillService
    {
        Task<List<SubSkillResponse>> GetAllBySkill(Guid skillId);
        Task<List<SubSkillResponse>> GetCompleted(Guid skillId);
        Task<SubSkillResponse> Create(SubSkillRequest  request);
        Task<SubSkillResponse> Update(SubSkillRequest request, Guid subskillId);
        Task<bool> Delete(Guid subskillId); //fetch via GetById, remove it
        Task<SubSkillResponse> MarkAsComplete_Or_Incomplete(Guid subskillId);
        Task<List<SubSkillResponse>> GetWithProgress(Guid skillId);
    }
}
