using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos.Users;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services.IServices;
using System;

namespace Services.Services
{
    public class UserService : IUserService
    {
        private readonly ILogger _logger;
        private readonly SkillDbContext _ctx;

        public UserService(SkillDbContext ctx, ILogger logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public async Task<UserResponse> Create(UserRequest request)
        {
            var user = new User
            {
                UserName = request.Name,
                UserEmail = request.UserEmail,
                HashPassword = request.HashPassword,
                CreatedAt = DateTime.Now,
            };

            _ctx.Add(user);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation("User now created");
            return UserResponse.FromUser(user);
        }

        public async Task<bool> Delete(Guid id)
        {
            var removeId = await _ctx.User.FindAsync(id);
            if (removeId == null)
            {
                _logger.LogWarning($"Warning: Could not find id: {removeId}");
                return false;
            }
            _ctx.Remove(removeId);
            await _ctx.SaveChangesAsync();
            _logger.LogInformation($"Information: Successfully removed user: {removeId}");
            return true;
        }

        public async Task<List<UserResponse>> GetAll()
        {
            var getall = _ctx.User;
            return await getall.Select(u => UserResponse.FromUser(u)).ToListAsync();
        }

        public async Task<UserResponse> GetById(string id)
        {
            var findId = await _ctx.User.FindAsync(id);
            if(findId == null)
            {
                _logger.LogWarning($"Warning: Could find the id: {id}");
                return null;
            }

            return UserResponse.FromUser(findId);
        }

        public Task<UserResponse> Update(Guid id, UserRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
