using static Domain.Skills;

namespace Infrastructure.Dtos.SKills
{
    public record SkillCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }

        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        public ShapeType Shape { get; set; }
    }
}