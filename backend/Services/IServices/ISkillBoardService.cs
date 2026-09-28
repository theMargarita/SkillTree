using Infrastructure.Dtos.SkillBoard;
using Infrastructure.Dtos.SkillBoards;

namespace Services.IServices
{
    public interface ISkillBoardService
    {
        Task<SkillBoardResponse> Create(Guid userId, SkillBoardRequest request);
        Task<SkillBoardResponse> Update(Guid id, SkillBoardRequest request);
        Task<bool> Delete(Guid id);
        Task<List<SkillBoardResponse>> GetAllForUser(Guid userId);

        //board fields + its skills with progress counts + its connections
        Task<SkillBoardDetailResponse> GetBoardDetail(Guid id);
    }
}
