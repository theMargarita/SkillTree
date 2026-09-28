using System.Text.Json.Serialization;

namespace Infrastructure.Dtos.SkillConnection
{
    public class SkillConnectionRequest
    {
        //[JsonPropertyName("skillboardId")]
        public Guid SkillBoardId { get; set; }
        public Guid FromSkillId { get; set; } 
        public Guid ToSkillId { get; set; }
        public string? LineColor { get; set; }
        public string? LineStyle { get; set; }
    }
}
