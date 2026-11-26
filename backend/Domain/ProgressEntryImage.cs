using Domain;

public class ProgressEntryImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProgressEntryId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int OrderIndex { get; set; }

    public ProgressEntries ProgressEntry { get; set; } = null!;
}