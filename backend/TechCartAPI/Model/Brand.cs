namespace TechCartAPI.Models;

public class Brand
{
    public int     BrandId  { get; set; }
    public string  Name     { get; set; } = string.Empty;
    public string? LogoUrl  { get; set; }
    public bool    IsActive { get; set; } = true;

    public List<Product> Products { get; set; } = new();
}