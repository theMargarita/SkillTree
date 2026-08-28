using Infrastructure.Dtos.SubSkill;

namespace Services.IServices
{
    public interface ISubSkillService
    {
        Task<List<SubSkillResponse>> GetAllBySkill(Guid skillId);
        Task<List<SubSkillResponse>> GetCompleted();
        Task<SubSkillResponse> Create(SubSkillRequest  request);
        Task<SubSkillResponse> Update(SubSkillRequest request);
        Task<bool> Delete(Guid subskillId); //fetch via GetByIdBasic, remove it
        Task<bool> MarkAsComplete(SubSkillRequest request);
        Task<bool> MarkAsIncomplete(SubSkillRequest request); //not sure about this
        Task<List<SubSkillResponse>> GetWithProgress();
    }
}
