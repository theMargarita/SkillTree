using Infrastructure.Dtos.Users;

namespace Services.IServices
{
    public interface IUserService
    {
        Task<UserResponse> Create(UserRequest request);
        Task<UserResponse> Update(Guid id, UserRequest request);
        Task<bool> Delete(Guid id);
        Task<UserResponse> GetAll();
        Task<List<UserResponse>> GetById(string id);
    }
}
