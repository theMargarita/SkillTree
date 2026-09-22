using static Domain.Skills;

namespace Infrastructure.Dtos.SKills
{
    public record SkillRequest
    {
        // Which board this skill belongs to. Required on Create.
        // Ignored on Update - a skill shouldn't move boards through an edit call.
        public Guid SkillBoardId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }

        // Canvas position + shape - needed so a node can be placed and dragged.
        public decimal PositionX { get; set; }
        public decimal PositionY { get; set; }
        public ShapeType Shape { get; set; }

        //should also have subskills
    }
}