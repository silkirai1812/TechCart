namespace TechCartAPI.DTOs;

public class CreateOrderDto
{
    public string?                  ShippingAddress { get; set; }
    public string?                  PaymentMethod   { get; set; }
    public List<CreateOrderItemDto> Items           { get; set; } = new();
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; }
}

public class OrderDto
{
    public int               OrderId         { get; set; }
    public string            Status          { get; set; } = string.Empty;
    public decimal           TotalAmount     { get; set; }
    public string?           ShippingAddress { get; set; }
    public string?           PaymentMethod   { get; set; }
    public string?           PaymentStatus   { get; set; }
    public DateTime          OrderDate       { get; set; }
    public string            CustomerName    { get; set; } = string.Empty;
    public List<OrderItemDto> Items          { get; set; } = new();
}

public class OrderItemDto
{
    public int     ProductId   { get; set; }
    public string  ProductName { get; set; } = string.Empty;
    public int     Quantity    { get; set; }
    public decimal UnitPrice   { get; set; }
    public decimal LineTotal   { get; set; }
}