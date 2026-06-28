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
public class CartController : ControllerBase
{
    private readonly TechCartContext _context;

    public CartController(TechCartContext context)
    {
        _context = context;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET api/cart
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();

        var items = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto
            {
                CartItemId  = c.CartItemId,
                ProductId   = c.ProductId,
                ProductName = c.Product.Name,
                ImageUrl    = c.Product.ImageUrl,
                Price       = c.Product.DiscountPrice ?? c.Product.Price,
                Quantity    = c.Quantity,
                LineTotal   = c.Quantity * (c.Product.DiscountPrice ?? c.Product.Price)
            })
            .ToListAsync();

        return Ok(new CartDto { Items = items });
    }

    // POST api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart(AddToCartDto dto)
    {
        var userId = GetUserId();

        // Check product exists and has stock
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null || !product.IsActive)
            return NotFound(new { message = "Product not found" });

        if (product.Stock < dto.Quantity)
            return BadRequest(new { message = "Insufficient stock" });

        // Check if already in cart — update quantity instead
        var existing = await _context.CartItems
            .FirstOrDefaultAsync(c =>
                c.UserId == userId && c.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem
            {
                UserId    = userId,
                ProductId = dto.ProductId,
                Quantity  = dto.Quantity
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Added to cart" });
    }

    // PUT api/cart
    [HttpPut]
    public async Task<IActionResult> UpdateCart(UpdateCartDto dto)
    {
        var userId = GetUserId();

        var item = await _context.CartItems
            .FirstOrDefaultAsync(c =>
                c.CartItemId == dto.CartItemId && c.UserId == userId);

        if (item == null)
            return NotFound(new { message = "Cart item not found" });

        if (dto.Quantity <= 0)
        {
            _context.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = dto.Quantity;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cart updated" });
    }

    // DELETE api/cart/5
    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveFromCart(int cartItemId)
    {
        var userId = GetUserId();

        var item = await _context.CartItems
            .FirstOrDefaultAsync(c =>
                c.CartItemId == cartItemId && c.UserId == userId);

        if (item == null)
            return NotFound(new { message = "Cart item not found" });

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Item removed" });
    }

    // DELETE api/cart/clear
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();

        var items = await _context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Cart cleared" });
    }
}