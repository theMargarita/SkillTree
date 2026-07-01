namespace Domain
{
    public class Skills
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        //would be cool to create a 3d skill tree - perhapns in the future
        //public decimal PositionZ { get; set; } 
        public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        //shape of the skill
        public int Shape { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        //this part might just be in subbskills - can stay for now
        //public string? ProgressURL { get; set; } 
        //public string? ProgressText { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
