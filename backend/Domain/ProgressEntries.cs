namespace Domain
{
    public class ProgressEntries
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SubSkillId { get; set; }
        public string? ContentText { get; set; } //and this to 
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public SubSkills SubSkills { get; set; } = null!;
        public ICollection<ProgressEntryImage> Images {get; set; } = new List<ProgressEntryImage>();
    }
}
