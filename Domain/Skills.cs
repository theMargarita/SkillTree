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

        public ShapeType Shape { get; set; }
  
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public enum ShapeType { Circle, Square, Hexagon, Diamond }

        public ICollection<SubSkills> SubSkills { get; set; } = new List<SubSkills>();
    }

}
