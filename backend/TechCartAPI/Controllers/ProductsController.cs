using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCartAPI.Data;
using TechCartAPI.DTOs;
using TechCartAPI.Models;

namespace TechCartAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly TechCartContext _context;

    public ProductsController(TechCartContext context)
    {
        _context = context;
    }

    // GET api/products
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int?    categoryId,
        [FromQuery] int?    brandId,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool?   featured,
        [FromQuery] string  sortBy   = "name",
        [FromQuery] int     page     = 1,
        [FromQuery] int     pageSize = 12)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Reviews)
            .Where(p => p.IsActive)
            .AsQueryable();

        // Filters
        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        if (brandId.HasValue)
            query = query.Where(p => p.BrandId == brandId);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p =>
                p.Name.Contains(search) ||
                p.Description!.Contains(search));

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice);

        if (featured.HasValue)
            query = query.Where(p => p.IsFeatured == featured);

        // Sorting
        query = sortBy.ToLower() switch
        {
            "price_asc"  => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "newest"     => query.OrderByDescending(p => p.CreatedAt),
            _            => query.OrderBy(p => p.Name)
        };

        // Pagination
        var total    = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = products.Select(p => new ProductDto
        {
            ProductId     = p.ProductId,
            Name          = p.Name,
            Description   = p.Description,
            Price         = p.Price,
            DiscountPrice = p.DiscountPrice,
            Stock         = p.Stock,
            SKU           = p.SKU,
            ImageUrl      = p.ImageUrl,
            Specifications = p.Specifications,
            IsFeatured    = p.IsFeatured,
            IsActive      = p.IsActive,
            CategoryName  = p.Category.Name,
            BrandName     = p.Brand.Name,
            CategoryId    = p.CategoryId,
            BrandId       = p.BrandId,
            AverageRating = p.Reviews.Any()
                            ? p.Reviews.Average(r => r.Rating)
                            : 0,
            ReviewCount   = p.Reviews.Count
        });

        return Ok(new
        {
            data       = result,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize)
        });
    }

    // GET api/products/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.ProductId == id && p.IsActive);

        if (p == null) return NotFound(new { message = "Product not found" });

        return Ok(new
        {
            productId     = p.ProductId,
            name          = p.Name,
            description   = p.Description,
            price         = p.Price,
            discountPrice = p.DiscountPrice,
            stock         = p.Stock,
            sku           = p.SKU,
            imageUrl      = p.ImageUrl,
            specifications = p.Specifications,
            isFeatured    = p.IsFeatured,
            categoryName  = p.Category.Name,
            brandName     = p.Brand.Name,
            categoryId    = p.CategoryId,
            brandId       = p.BrandId,
            averageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
            reviewCount   = p.Reviews.Count,
            reviews       = p.Reviews.Select(r => new ReviewDto
            {
                ReviewId  = r.ReviewId,
                Rating    = r.Rating,
                Comment   = r.Comment,
                UserName  = $"{r.User.FirstName} {r.User.LastName}",
                CreatedAt = r.CreatedAt
            })
        });
    }

    // POST api/products — Admin only
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var product = new Product
        {
            Name           = dto.Name,
            Description    = dto.Description,
            Price          = dto.Price,
            DiscountPrice  = dto.DiscountPrice,
            Stock          = dto.Stock,
            SKU            = dto.SKU,
            ImageUrl       = dto.ImageUrl,
            Specifications = dto.Specifications,
            IsFeatured     = dto.IsFeatured,
            CategoryId     = dto.CategoryId,
            BrandId        = dto.BrandId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = product.ProductId }, product);
    }

    // PUT api/products/5 — Admin only
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        product.Name           = dto.Name;
        product.Description    = dto.Description;
        product.Price          = dto.Price;
        product.DiscountPrice  = dto.DiscountPrice;
        product.Stock          = dto.Stock;
        product.SKU            = dto.SKU;
        product.ImageUrl       = dto.ImageUrl;
        product.Specifications = dto.Specifications;
        product.IsFeatured     = dto.IsFeatured;
        product.CategoryId     = dto.CategoryId;
        product.BrandId        = dto.BrandId;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Product updated" });
    }

    // DELETE api/products/5 — Admin only
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        // Soft delete
        product.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Product deleted" });
    }
}