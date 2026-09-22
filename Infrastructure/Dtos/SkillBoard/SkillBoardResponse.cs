using Domain;

namespace Infrastructure.Dtos.SkillBoards
{
    public record SkillBoardResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? BackgroundColor { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        // Optional: how many skills are on this board.
        // Cheap to add if the query behind it is a Count(), not a full Include.
        public int SkillCount { get; set; }

        public static SkillBoardResponse FromBoard(SkillBoard board, int skillCount = 0)
        {
            return new SkillBoardResponse
            {
                Id = board.Id,
                Name = board.Name,
                Description = board.Description,
                BackgroundColor = board.BackgroundColor,
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt,
                SkillCount = skillCount,
            };
        }
    }
}