namespace TechCartAPI.Models;

public class Order
{
    public int      OrderId         { get; set; }
    public string   Status          { get; set; } = "Pending";
    public decimal  TotalAmount     { get; set; }
    public string?  ShippingAddress { get; set; }
    public string?  PaymentMethod   { get; set; }
    public string?  PaymentStatus   { get; set; } = "Pending";
    public DateTime OrderDate       { get; set; } = DateTime.UtcNow;

    public int     UserId      { get; set; }
    public User    User        { get; set; } = null!;

    public List<OrderItem> OrderItems { get; set; } = new();
}