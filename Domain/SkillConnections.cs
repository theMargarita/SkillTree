namespace Domain
{
    public class SkillConnections
    {
        public Guid Id { get; set; } = Guid.NewGuid(); 
        public Guid SkillBoardId { get; set; }
        public Guid FromSkillId { get; set; } //foreign key from skills
        public Guid ToSkillId { get; set; }//foreign key from skills
        public string? LineColor { get; set; }
        public string? LineStyle { get; set; }
    }
}
