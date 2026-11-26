using Domain;

namespace Infrastructure.Dtos.ProgressEntry
{
    public record ProgressEntryImageRequest
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int OrderIndex { get; set; }
    }

    public record ProgressEntryRequest
    {
        public Guid SubSkillId { get; set; }
        public string? ContentText { get; set; }
        public List<ProgressEntryImageRequest> Images { get; set; } = new();
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
