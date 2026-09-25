using Infrastructure.Dtos.SKills;

namespace Infrastructure.Dtos.SkillBoards
{
    public class SkillBoardResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? BackgroundColor { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        //public ICollection<SkillResponse> SkillResponse { get; set; } = new List<SkillResponse>();

        public int SkillCount { get; set; }

        public static SkillBoardResponse FromBoard(Domain.SkillBoard board, int skillCount)
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
                //SkillResponse = new List<SkillResponse>()
            };
        }
    }
}