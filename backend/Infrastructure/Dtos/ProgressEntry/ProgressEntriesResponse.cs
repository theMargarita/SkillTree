using Domain;
namespace Infrastructure.Dto
{
    public class ProgressEntryResponse
    {
        public Guid Id { get; set; }
        public ProgressType? Type { get; set; }
        public string? ImageUrl { get; set; }
        public string? ContentText { get; set; }
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
