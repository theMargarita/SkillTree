using Domain;
using static Domain.Skills;
using static Infrastructure.Dtos.ProgressEntry.StatusEnum;

namespace Infrastructure.Dtos.SKills
{
    public record SkillResponse
    {
        public Guid Id { get; set; }
        public Guid SkillBoardId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        //public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public ShapeType Shape { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public int CompletedSubSkillCount { get; set; }
        public int SubSkillCount { get; set; }
        public SkillStatus Status { get; set; }

  public static SkillResponse FromSkill(Skills skill,
    int completedSubSkillCount = 0,
    int subSkillCount = 0,
    SkillStatus status = SkillStatus.Unlocked)
        {
            return new SkillResponse
            {
                Id = skill.Id,
                SkillBoardId = skill.SkillBoardId,
                Name = skill.Name,
                Description = skill.Description,
                ImageUrl = skill.ImageUrl,
                PositionX = skill.PositionX,
                PositionY = skill.PositionY,
                //RequiredSubSkillCount = skill.RequiredSubSkillCount,
                Color = skill.Color,
                Icon = skill.Icon,
                Shape = skill.Shape,
                CreatedAt = skill.CreatedAt,
                UpdatedAt = skill.UpdatedAt,
                CompletedSubSkillCount = completedSubSkillCount,
                SubSkillCount = skill.SubSkills.Count,  
                Status = status,
            };
        }
    }
}