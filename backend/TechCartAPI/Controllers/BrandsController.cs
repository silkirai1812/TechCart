using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCartAPI.Data;
using TechCartAPI.Models;

namespace TechCartAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly TechCartContext _context;

    public BrandsController(TechCartContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brands = await _context.Brands
            .Where(b => b.IsActive)
            .Select(b => new
            {
                b.BrandId,
                b.Name,
                b.LogoUrl,
                ProductCount = b.Products.Count(p => p.IsActive)
            })
            .ToListAsync();

        return Ok(brands);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return NotFound(new { message = "Brand not found" });
        return Ok(brand);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(Brand brand)
    {
        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        return Ok(brand);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, Brand updated)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return NotFound(new { message = "Brand not found" });

        brand.Name    = updated.Name;
        brand.LogoUrl = updated.LogoUrl;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Brand updated" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return NotFound(new { message = "Brand not found" });

        brand.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Brand deleted" });
    }
}