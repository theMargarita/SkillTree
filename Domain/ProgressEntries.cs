namespace Domain
{
    public class ProgressEntries
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SubSKillId { get; set; }
        public Type? Type { get; set; } //photo, text or both
        public string? ImageUrl { get; set; }
        public string? ContentText { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
