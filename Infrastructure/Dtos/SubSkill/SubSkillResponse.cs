using Domain;
using Infrastructure.Dto;
namespace Infrastructure.Dtos.SubSkill
{
    public class SubSkillResponse
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SkillsId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ProgressURL { get; set; }
        public string? ProgressText { get; set; }
        public List<ProgressEntryResponse> ProgressEntries { get; set; } = new(); //remeber that this is only in repsonse and not in request
        public int OrderIndex { get; set; }
        public string? Color { get; set; }
        public bool IsComplete { get; set; } = false;
        public DateTimeOffset? CompletedAt { get; set; }

        public static SubSkillResponse FromSubSkill(SubSkills sb)
        {
            return new SubSkillResponse
            {
                Id = sb.Id,
                SkillsId = sb.SkillsId,
                Name = sb.Name,
                Description = sb.Description,
                ProgressURL = sb.ProgressURL,
                ProgressEntries = sb.ProgressEntries.Select(ProgressEntryResponse.FromEntry).ToList(),
                ProgressText = sb.ProgressText,
                OrderIndex = sb.OrderIndex,
                Color = sb.Color,
                CompletedAt = sb.CompletedAt,
                IsComplete = sb.IsComplete,
            };
        }
    }
}
