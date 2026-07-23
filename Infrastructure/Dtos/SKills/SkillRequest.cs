namespace Infrastructure.Dtos.SKills
{
    public record SkillRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int RequiredSubSkillCount { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }

        //should also have subskills
    }
}

