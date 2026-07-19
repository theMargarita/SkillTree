using Domain;

namespace Infrastructure.Dtos.SKills
{
    public record SkillResponse
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public int Shape { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
