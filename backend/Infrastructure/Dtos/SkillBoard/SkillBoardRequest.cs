using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Dtos.SkillBoard
{
    public class SkillBoardRequest
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        //public string Description { get; set; } = string.Empty;
        public string? BackgroundColor { get; set; } = null;
        // public DateTimeOffset CreatedAt { get; set; }
        // public DateTimeOffset UpdatedAt { get; set; }
        // public ICollection<SkillCreateRequest> Skills { get; set; } = new List<SkillCreateRequest>();
    }
}
