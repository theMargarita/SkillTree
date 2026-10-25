using System.ComponentModel.DataAnnotations;
using static Domain.Skills;

namespace Infrastructure.Dtos.SKills
{
    public record SkillRequest
    {
        public Guid SkillBoardId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        [Range(1, 100)]
        // public int RequiredSubSkillCount { get; set; } = 1;

        public string? Color { get; set; }
        public string? Icon { get; set; }
        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        public ShapeType Shape { get; set; }
    }
}