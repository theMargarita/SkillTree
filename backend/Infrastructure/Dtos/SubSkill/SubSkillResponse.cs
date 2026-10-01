using Domain;
using Infrastructure.Dto;
using System.Text.Json.Serialization;
namespace Infrastructure.Dtos.SubSkill
{
    public class SubSkillResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; } = Guid.NewGuid();
        [JsonPropertyName("skillsId")]
        public Guid SkillsId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("decsription")]
        public string Description { get; set; } = string.Empty;
        [JsonPropertyName("progressUrl")]
        public string? ProgressURL { get; set; }
        [JsonPropertyName("progressText")]
        public string? ProgressText { get; set; }
        [JsonPropertyName("progressEntry")]

        public List<ProgressEntryResponse> ProgressEntries { get; set; } = new(); //remeber that this is only in repsonse and not in request
        [JsonPropertyName("orderIndex")]
        public int OrderIndex { get; set; }
        [JsonPropertyName("color")]
        public string? Color { get; set; }
        [JsonPropertyName("isComplete")]
        public bool IsComplete { get; set; } = false; [JsonPropertyName("createdAt")]
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
