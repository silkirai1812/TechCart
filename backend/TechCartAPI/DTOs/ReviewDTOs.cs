namespace TechCartAPI.DTOs;

public class CreateReviewDto
{
    public int     ProductId { get; set; }
    public int     Rating    { get; set; }
    public string? Comment   { get; set; }
}

public class ReviewDto
{
    public int      ReviewId  { get; set; }
    public int      Rating    { get; set; }
    public string?  Comment   { get; set; }
    public string   UserName  { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}