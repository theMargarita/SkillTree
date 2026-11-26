namespace Domain
{
    public class ProgressEntries
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SubSkillId { get; set; }
        public ProgressType? Type { get; set; } //photo, text or both
        public string? ImageUrl { get; set; } //might need to be a list
        public string? ContentText { get; set; } //and this to 
        // public string? VideoUrl { get; set; } //to be able to ad video if the user wishes 
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public SubSkills SubSkills { get; set; } = null!;
    }

    //photo, text or both
    //might actually remove this
    public enum ProgressType
    {
        Photo = 0,
        Text = 1,
        PhotoAndText = 3,
        Video = 4 //blob? 
    }
}
