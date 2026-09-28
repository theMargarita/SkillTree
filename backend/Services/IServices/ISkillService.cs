using Infrastructure.Dtos.SKills;

namespace Services.IServices
{
    public interface ISkillService
    {
        Task<SkillResponse> Create(SkillRequest request);
        //update name, description, background color
        Task<SkillResponse> Update(Guid id, SkillRequest request);
        Task<bool> Delete(Guid id);

        //perhaps get tree through skill name? 
        Task<SkillResponse> GetSkillTreeById(Guid id);
        Task<List<SkillResponse>> GetAllSkillsAsync();
    }
}
