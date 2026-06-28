namespace TechCartAPI.Models;

public class CartItem
{
    public int      CartItemId { get; set; }
    public int      Quantity   { get; set; }
    public DateTime AddedAt    { get; set; } = DateTime.UtcNow;

    public int     UserId    { get; set; }
    public int     ProductId { get; set; }

    public User    User      { get; set; } = null!;
    public Product Product   { get; set; } = null!;
}
