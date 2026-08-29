using Domain;
namespace Infrastructure.Dtos.SubSkill
{
    public class SubSkillResponse
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SkillId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ProgressURL { get; set; }
        public string? ProgressText { get; set; }
        public int OrderIndex { get; set; }
        public string? Color { get; set; }
        public bool IsComplete { get; set; } = false;
        public DateTimeOffset CompletedAt { get; set; }

        public static SubSkillResponse FromSubSkill(SubSkills sb)
        {
            return new SubSkillResponse
            {
                Id = sb.Id,
                SkillId = sb.SkillId,
                Name = sb.Name,
                Description = sb.Description,
                ProgressURL = sb.ProgressURL,
                ProgressText = sb.ProgressText,
                OrderIndex = sb.OrderIndex,
                Color = sb.Color,
                CompletedAt = sb.CompletedAt,
                IsComplete = sb.IsComplete,
            };
        }
    }
}
