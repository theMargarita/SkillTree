using DataAnnotationsExtensions;

namespace Infrastructure.Dtos.Users
{
    public class UserRequest
    {
        public string Name { get; set; } = string.Empty;
        [Email]
        public string UserEmail { get; set; } = string.Empty;
        public string HashPassward { get; set; } = string.Empty;
    }
}
