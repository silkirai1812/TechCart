namespace TechCartAPI.Models;

public class Review
{
    public int      ReviewId  { get; set; }
    public int      Rating    { get; set; }  // 1 to 5
    public string?  Comment   { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int     UserId    { get; set; }
    public int     ProductId { get; set; }

    public User    User      { get; set; } = null!;
    public Product Product   { get; set; } = null!;
}