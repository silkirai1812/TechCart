namespace TechCartAPI.Models;

public class User
{
    public int      UserId       { get; set; }
    public string   FirstName    { get; set; } = string.Empty;
    public string   LastName     { get; set; } = string.Empty;
    public string   Email        { get; set; } = string.Empty;
    public string   PasswordHash { get; set; } = string.Empty;
    public string   Role         { get; set; } = "Customer";
    public string?  Phone        { get; set; }
    public string?  Address      { get; set; }
    public bool     IsActive     { get; set; } = true;
    public DateTime CreatedAt    { get; set; } = DateTime.UtcNow;

    public List<Order>    Orders    { get; set; } = new();
    public List<CartItem> CartItems { get; set; } = new();
    public List<Review>   Reviews   { get; set; } = new();
}