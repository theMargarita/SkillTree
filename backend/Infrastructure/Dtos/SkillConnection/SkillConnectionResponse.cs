using Domain;

namespace Infrastructure.Dtos
{
    public record SkillConnectionResponse
    {
        public Guid Id { get; set; }
        public Guid SkillBoardId { get; set; }
        public Guid FromSkillId { get; set; }
        public Guid ToSkillId { get; set; }
        public string? LineColor { get; set; }
        public string? LineStyle { get; set; }

        public static SkillConnectionResponse FromConnection(SkillConnections c)
        {
            return new SkillConnectionResponse
            {
                Id = c.Id,
                SkillBoardId = c.SkillBoardId,
                FromSkillId = c.FromSkillId,
                ToSkillId = c.ToSkillId,
                LineColor = c.LineColor,
                LineStyle = c.LineStyle,
            };
        }
    }
}