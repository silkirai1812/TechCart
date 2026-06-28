using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCartAPI.Data;
using TechCartAPI.DTOs;
using TechCartAPI.Models;
using TechCartAPI.Services;

namespace TechCartAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TechCartContext _context;
    private readonly TokenService   _tokenService;

    public AuthController(TechCartContext context, TokenService tokenService)
    {
        _context      = context;
        _tokenService = tokenService;
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email already registered" });

        var user = new User
        {
            FirstName    = dto.FirstName,
            LastName     = dto.LastName,
            Email        = dto.Email,
            Phone        = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role         = "Customer"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token    = token,
            Email    = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role     = user.Role,
            Expiry   = DateTime.UtcNow.AddMinutes(60)
        });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token    = token,
            Email    = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role     = user.Role,
            Expiry   = DateTime.UtcNow.AddMinutes(60)
        });
    }
}