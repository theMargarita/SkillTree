namespace Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string HashPassword { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
    }
}
