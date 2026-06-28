namespace TechCartAPI.DTOs;

public class ProductDto
{
    public int      ProductId     { get; set; }
    public string   Name          { get; set; } = string.Empty;
    public string?  Description   { get; set; }
    public decimal  Price         { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int      Stock         { get; set; }
    public string?  SKU           { get; set; }
    public string?  ImageUrl      { get; set; }
    public string?  Specifications { get; set; }
    public bool     IsFeatured    { get; set; }
    public bool     IsActive      { get; set; }
    public string   CategoryName  { get; set; } = string.Empty;
    public string   BrandName     { get; set; } = string.Empty;
    public int      CategoryId    { get; set; }
    public int      BrandId       { get; set; }
    public double   AverageRating { get; set; }
    public int      ReviewCount   { get; set; }
}

public class CreateProductDto
{
    public string   Name           { get; set; } = string.Empty;
    public string?  Description    { get; set; }
    public decimal  Price          { get; set; }
    public decimal? DiscountPrice  { get; set; }
    public int      Stock          { get; set; }
    public string?  SKU            { get; set; }
    public string?  ImageUrl       { get; set; }
    public string?  Specifications { get; set; }
    public bool     IsFeatured     { get; set; }
    public int      CategoryId     { get; set; }
    public int      BrandId        { get; set; }
}

public class UpdateProductDto : CreateProductDto
{
    public int ProductId { get; set; }
}