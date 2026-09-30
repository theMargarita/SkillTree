
using System.Text.Json.Serialization;

namespace Infrastructure.Dtos.Users
{
    public class UserRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string UserEmail { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string HashPassword { get; set; } = string.Empty;
    }
}
