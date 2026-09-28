namespace Domain
{
    public class ProgressEntries
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SubSkillId { get; set; }
        public ProgressType? Type { get; set; } //photo, text or both
        public string? ImageUrl { get; set; }
        public string? ContentText { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public SubSkills SubSkills { get; set; } = null!;
    }

    //photo, text or both
    public enum ProgressType
    {
        Photo = 0,
        Text = 1,
        PhotoAndText = 3
    }
}
