using Domain;

namespace Infrastructure.Dtos.Users
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty.ToString();
        public DateTimeOffset CreatedAt { get; set; }

        public static UserResponse FromUser(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Name = user.UserName,
                UserEmail = user.UserEmail,
                CreatedAt = user.CreatedAt,
            };
        }
    }
}
