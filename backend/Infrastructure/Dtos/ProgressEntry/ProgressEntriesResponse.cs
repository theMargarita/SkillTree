using Domain;
using System.Text.Json.Serialization;
namespace Infrastructure.Dto
{
    public class ProgressEntryResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("contentText")]
        public string? ContentText { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTimeOffset CreatedAt { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTimeOffset UpdatedAt{get; set; }

        public ICollection<ProgressEntryImageResponse> Images = new List<ProgressEntryImageResponse>();

        public static ProgressEntryResponse FromEntry(ProgressEntries e) => new()
        {
            Id = e.Id,
            ContentText = e.ContentText,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            Images = e.Images
            .OrderBy(i => i.OrderIndex)
            .Select(i => new ProgressEntryImageResponse
            {
                Id = i.Id,
                ProgressEntryId  = i.ProgressEntryId,
                ImageUrl = i.ImageUrl,
                Caption = i.Caption,
                OrderIndex = i.OrderIndex,
            }).ToList(),
        };
    }

    public record ProgressEntryImageResponse
    {
        [JsonPropertyName("id")]
        public Guid Id {get; set; }

        [JsonPropertyName("entryId")]
        public Guid ProgressEntryId  { get; set; }

        [JsonPropertyName("imageUrl")]
        public string? ImageUrl { get; set; }

        [JsonPropertyName("Caption")]
        public string? Caption {get; set; }

        [JsonPropertyName("OrderIndex")]
        public int OrderIndex {get; set; }
    }
}
