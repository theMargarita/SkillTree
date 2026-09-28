using Infrastructure.Dtos;
using Infrastructure.Dtos.SkillConnection;

namespace Services.IServices
{
    public interface ISkillConnectionService
    {
        Task<SkillConnectionResponse> Create(SkillConnectionRequest request);
        Task<bool> Delete(Guid id);
    }
}
