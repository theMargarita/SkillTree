namespace Domain
{
    public class SubSkills
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SkillId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        //progress savings
        public string? ProgressURL { get; set; }
        public string? ProgressText { get; set; }
        public int OrderIndex { get; set; }
        public string? Color { get; set; }
        public bool IsComplete { get; set; } = false;
        public DateTimeOffset? CompletedAt { get; set; }

        public Skills Skills { get; set; } = null!;
        public ICollection<ProgressEntries> ProgressEntries = new List<ProgressEntries>();
    }
}
