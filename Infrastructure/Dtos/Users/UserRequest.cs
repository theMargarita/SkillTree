
namespace Infrastructure.Dtos.Users
{
    public class UserRequest
    {
        public string Name { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string HashPassword { get; set; } = string.Empty;
    }
}
