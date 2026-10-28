using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Dtos.SKills
{
    public record SkillPositionRequest
    {
        //server does not trust the browsers clamping, so reject absurd values here
        [Range(-10000,10000)]
        public decimal PositionX { get; set; }

        [Range(-10000, 10000)]

        public decimal PositionY { get; set; }

    }
}
