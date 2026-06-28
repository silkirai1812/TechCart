using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCartAPI.Data;
using TechCartAPI.DTOs;
using TechCartAPI.Models;

namespace TechCartAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly TechCartContext _context;

    public OrdersController(TechCartContext context)
    {
        _context = context;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET api/orders — my orders
    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetUserId();

        var orders = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderDto
            {
                OrderId         = o.OrderId,
                Status          = o.Status,
                TotalAmount     = o.TotalAmount,
                ShippingAddress = o.ShippingAddress,
                PaymentMethod   = o.PaymentMethod,
                PaymentStatus   = o.PaymentStatus,
                OrderDate       = o.OrderDate,
                CustomerName    = $"{o.User.FirstName} {o.User.LastName}",
                Items           = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId   = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity    = oi.Quantity,
                    UnitPrice   = oi.UnitPrice,
                    LineTotal   = oi.Quantity * oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET api/orders/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var role   = User.FindFirstValue(ClaimTypes.Role);

        var order = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
            return NotFound(new { message = "Order not found" });

        // Customers can only see their own orders
        if (role != "Admin" && order.UserId != userId)
            return Forbid();

        return Ok(new OrderDto
        {
            OrderId         = order.OrderId,
            Status          = order.Status,
            TotalAmount     = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            PaymentMethod   = order.PaymentMethod,
            PaymentStatus   = order.PaymentStatus,
            OrderDate       = order.OrderDate,
            CustomerName    = $"{order.User.FirstName} {order.User.LastName}",
            Items           = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId   = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity    = oi.Quantity,
                UnitPrice   = oi.UnitPrice,
                LineTotal   = oi.Quantity * oi.UnitPrice
            }).ToList()
        });
    }

    // POST api/orders
    [HttpPost]
    public async Task<IActionResult> PlaceOrder(CreateOrderDto dto)
    {
        var userId = GetUserId();

        // Validate all products exist and have stock
        var orderItems = new List<OrderItem>();
        decimal total  = 0;

        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);

            if (product == null || !product.IsActive)
                return BadRequest(new
                    { message = $"Product {item.ProductId} not found" });

            if (product.Stock < item.Quantity)
                return BadRequest(new
                    { message = $"Insufficient stock for {product.Name}" });

            var unitPrice = product.DiscountPrice ?? product.Price;
            total        += unitPrice * item.Quantity;

            orderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity  = item.Quantity,
                UnitPrice = unitPrice
            });

            // Reduce stock
            product.Stock -= item.Quantity;
        }

        var order = new Order
        {
            UserId          = userId,
            TotalAmount     = total,
            ShippingAddress = dto.ShippingAddress,
            PaymentMethod   = dto.PaymentMethod,
            PaymentStatus   = "Pending",
            Status          = "Pending",
            OrderItems      = orderItems
        };

        _context.Orders.Add(order);

        // Clear cart after order
        var cartItems = await _context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();
        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Order placed successfully", orderId = order.OrderId });
    }

    // PUT api/orders/5/status — Admin only
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = "Order not found" });

        order.Status = status;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Order status updated" });
    }

    // GET api/orders/admin/all — Admin only
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders(
        [FromQuery] string? status,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total  = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderDto
            {
                OrderId         = o.OrderId,
                Status          = o.Status,
                TotalAmount     = o.TotalAmount,
                ShippingAddress = o.ShippingAddress,
                PaymentMethod   = o.PaymentMethod,
                PaymentStatus   = o.PaymentStatus,
                OrderDate       = o.OrderDate,
                CustomerName    = $"{o.User.FirstName} {o.User.LastName}",
                Items           = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId   = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity    = oi.Quantity,
                    UnitPrice   = oi.UnitPrice,
                    LineTotal   = oi.Quantity * oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(new { data = orders, total, page, pageSize });
    }
}