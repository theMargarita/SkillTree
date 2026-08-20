using Domain;
using Infrastructure.Data;
using Infrastructure.Dtos.Users;
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

        public Task<bool> Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<UserResponse> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<List<UserResponse>> GetById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<UserResponse> Update(Guid id, UserRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
