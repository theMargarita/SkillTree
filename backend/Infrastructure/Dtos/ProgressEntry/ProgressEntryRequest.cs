using Domain;

namespace Infrastructure.Dtos.ProgressEntry
{
    public record ProgressEntryRequest
    {
        public Guid SubSkillId { get; set; }
        //public ProgressType? Type { get; set; }
        public string? ImageUrl { get; set; }
        public string? ContentText { get; set; }
        // public string? VideoUrl { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
