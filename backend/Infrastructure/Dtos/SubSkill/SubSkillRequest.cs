using Infrastructure.Dto;
using System.Text.Json.Serialization;

namespace Infrastructure.Dtos.SubSkill
{
    public class SubSkillRequest
    {
        [JsonPropertyName("skillsId")]
        public Guid SkillId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("decsription")]
        public string Description { get; set; } = string.Empty;
        [JsonPropertyName("progressUrl")]
        public string? ProgressURL { get; set; }

        [JsonPropertyName("progressText")]
        public string? ProgressText { get; set; }
       
        [JsonPropertyName("orderIndex")]
        public int OrderIndex { get; set; }

        [JsonPropertyName("color")]
        public string? Color { get; set; }

        [JsonPropertyName("isComplete")]
        public bool IsComplete { get; set; } = false; 

        [JsonPropertyName("completedAt")]
        public DateTimeOffset CompletedAt { get; set; }
    }
}
