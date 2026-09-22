using Domain;
using static Domain.Skills;

namespace Infrastructure.Dtos.SKills
{
    public record SkillResponse
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SkillBoardId { get; set; }
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

        // How many of this skill's subskills are complete.
        // Filled in by the service with a Count() query - NOT by loading
        // every subskill - so the board load stays light.
        public int CompletedSubSkillCount { get; set; }

        public static SkillResponse FromSkill(Skills skill, int completedSubSkillCount = 0)
        {
            return new SkillResponse
            {
                Id = skill.Id,
                SkillBoardId = skill.SkillBoardId,
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
                CompletedSubSkillCount = completedSubSkillCount,
            };
        }
    }
}