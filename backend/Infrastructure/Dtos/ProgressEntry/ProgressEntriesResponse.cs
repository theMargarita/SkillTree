using Domain;
using System.Text.Json.Serialization;
namespace Infrastructure.Dto
{
    public class ProgressEntryResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("progressType")]
        public ProgressType? Type { get; set; }
        [JsonPropertyName("imageUrl")]
        public string? ImageUrl { get; set; }
        [JsonPropertyName("contentText")]
        public string? ContentText { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTimeOffset CreatedAt { get; set; }

        public static ProgressEntryResponse FromEntry(ProgressEntries e) => new()
        {
            Id = e.Id,
            Type = e.Type,
            ImageUrl = e.ImageUrl,
            ContentText = e.ContentText,
            CreatedAt = e.CreatedAt,
        };
    }
}
