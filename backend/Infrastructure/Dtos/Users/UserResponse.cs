using Domain;
using System.Text.Json.Serialization;

namespace Infrastructure.Dtos.Users
{
    public class UserResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string UserEmail { get; set; } = string.Empty.ToString();

        [JsonPropertyName("createdAt")]
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
