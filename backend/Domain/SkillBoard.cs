namespace Domain
{
    public class SkillBoard
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        // SkillsId removed: skills point to the board through Skills.SkillBoardId
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? BackgroundColor { get; set; } = null;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public ICollection<Skills> Skills { get; set; } = new List<Skills>();
    }
}