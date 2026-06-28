namespace TechCartAPI.Models;

public class Product
{
    public int      ProductId    { get; set; }
    public string   Name         { get; set; } = string.Empty;
    public string?  Description  { get; set; }
    public decimal  Price        { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int      Stock        { get; set; }
    public string?  SKU          { get; set; }
    public string?  ImageUrl     { get; set; }
    public string?  Specifications { get; set; }
    public bool     IsActive     { get; set; } = true;
    public bool     IsFeatured   { get; set; } = false;
    public DateTime CreatedAt    { get; set; } = DateTime.UtcNow;

    public int      CategoryId   { get; set; }
    public int      BrandId      { get; set; }

    public Category              Category   { get; set; } = null!;
    public Brand                 Brand      { get; set; } = null!;
    public List<OrderItem>       OrderItems { get; set; } = new();
    public List<CartItem>        CartItems  { get; set; } = new();
    public List<Review>          Reviews    { get; set; } = new();
}