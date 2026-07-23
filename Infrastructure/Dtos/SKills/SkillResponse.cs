using Domain;
using static Domain.Skills;

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
        public ShapeType Shape { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public static SkillResponse FromSkill(Skills skill)
        {
            return new SkillResponse
            {
                Id = skill.Id,
                Name = skill.Name,
                Description = skill.Description,
                PositionX = skill.PositionX,
                Shape = skill.Shape,
                PositionY = skill.PositionY,
                RequiredSubSkillCount = skill.RequiredSubSkillCount,
                Color = skill.Color,
                Icon = skill.Icon,
                CreatedAt = skill.CreatedAt,
                UpdatedAt = skill.UpdatedAt,
            };
        }
    }

}
