using Infrastructure.Dtos.SkillConnection;
using Infrastructure.Dtos.SKills;

namespace Infrastructure.Dtos.SkillBoards
{
    public record SkillBoardDetailResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? BackgroundColor { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public List<SkillResponse> Skills { get; set; } = new();
        public List<SkillConnectionResponse> Connections { get; set; } = new();

        // Built by the service from three already-queried pieces:
        // the board itself, its skills (with completed-subskill counts),
        // and its connections. Kept as a plain composer, not a FromX(entity)
        // method, since there's no single entity that represents "a board
        // with its skills and connections" - that shape only exists here.
        public static SkillBoardDetailResponse Compose(
            SkillBoard board,
            List<SkillResponse> skills,
            List<SkillConnectionResponse> connections)
        {
            return new SkillBoardDetailResponse
            {
                Id = board.Id,
                Name = board.Name,
                Description = board.Description,
                BackgroundColor = board.BackgroundColor,
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt,
                Skills = skills,
                Connections = connections,
            };
        }
    }
}