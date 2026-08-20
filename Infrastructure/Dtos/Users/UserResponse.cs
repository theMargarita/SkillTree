using DataAnnotationsExtensions;

namespace Infrastructure.Dtos.Users
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        [Email]
        public string UserEmail { get; set; } = string.Empty.ToString();
        public DateTimeOffset CreatedAt { get; set; }
    }
}
