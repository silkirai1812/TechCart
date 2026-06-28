namespace TechCartAPI.DTOs;

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; }
}

public class UpdateCartDto
{
    public int CartItemId { get; set; }
    public int Quantity   { get; set; }
}

public class CartItemDto
{
    public int     CartItemId   { get; set; }
    public int     ProductId    { get; set; }
    public string  ProductName  { get; set; } = string.Empty;
    public string? ImageUrl     { get; set; }
    public decimal Price        { get; set; }
    public int     Quantity     { get; set; }
    public decimal LineTotal    { get; set; }
}

public class CartDto
{
    public List<CartItemDto> Items     { get; set; } = new();
    public decimal           Total     => Items.Sum(i => i.LineTotal);
    public int               ItemCount => Items.Sum(i => i.Quantity);
}