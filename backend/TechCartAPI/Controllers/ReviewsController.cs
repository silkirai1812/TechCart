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
public class ReviewsController : ControllerBase
{
    private readonly TechCartContext _context;

    public ReviewsController(TechCartContext context)
    {
        _context = context;
    }

    // GET api/reviews/product/5
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetProductReviews(int productId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId  = r.ReviewId,
                Rating    = r.Rating,
                Comment   = r.Comment,
                UserName  = $"{r.User.FirstName} {r.User.LastName}",
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // POST api/reviews
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddReview(CreateReviewDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // One review per user per product
        var exists = await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.ProductId == dto.ProductId);

        if (exists)
            return BadRequest(new
                { message = "You have already reviewed this product" });

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var review = new Review
        {
            UserId    = userId,
            ProductId = dto.ProductId,
            Rating    = dto.Rating,
            Comment   = dto.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review added" });
    }

    // DELETE api/reviews/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role   = User.FindFirstValue(ClaimTypes.Role);

        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        if (role != "Admin" && review.UserId != userId)
            return Forbid();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Review deleted" });
    }
}