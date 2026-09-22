using Infrastructure.Dtos.SKills;
using Domain;

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

        public static SkillBoardDetailResponse Compose(
            Domain.SkillBoard board,
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