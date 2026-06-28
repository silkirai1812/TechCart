using Microsoft.EntityFrameworkCore;
using TechCartAPI.Models;

namespace TechCartAPI.Data;

public class TechCartContext : DbContext
{
    public TechCartContext(DbContextOptions<TechCartContext> options)
        : base(options) { }

    public DbSet<User>      Users      { get; set; }
    public DbSet<Category>  Categories { get; set; }
    public DbSet<Brand>     Brands     { get; set; }
    public DbSet<Product>   Products   { get; set; }
    public DbSet<CartItem>  CartItems  { get; set; }
    public DbSet<Order>     Orders     { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Review>    Reviews    { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.Property(u => u.Email).IsRequired().HasMaxLength(200);
            e.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
            e.Property(u => u.LastName).IsRequired().HasMaxLength(100);
            e.Property(u => u.Role).HasMaxLength(20).HasDefaultValue("Customer");
            e.HasIndex(u => u.Email).IsUnique();
        });

        // Category
        modelBuilder.Entity<Category>(e =>
        {
            e.Property(c => c.Name).IsRequired().HasMaxLength(100);
            e.Property(c => c.Description).HasMaxLength(500);
        });

        // Brand
        modelBuilder.Entity<Brand>(e =>
        {
            e.Property(b => b.Name).IsRequired().HasMaxLength(100);
        });

        // Product
        modelBuilder.Entity<Product>(e =>
        {
            e.Property(p => p.Name).IsRequired().HasMaxLength(200);
            e.Property(p => p.Price).HasColumnType("decimal(10,2)");
            e.Property(p => p.DiscountPrice).HasColumnType("decimal(10,2)");
            e.Property(p => p.SKU).HasMaxLength(50);
            e.Property(p => p.Description).HasMaxLength(2000);
            e.Property(p => p.Specifications).HasMaxLength(2000);

            e.HasOne(p => p.Category)
             .WithMany(c => c.Products)
             .HasForeignKey(p => p.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(p => p.Brand)
             .WithMany(b => b.Products)
             .HasForeignKey(p => p.BrandId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // CartItem
        modelBuilder.Entity<CartItem>(e =>
        {
            e.HasOne(c => c.User)
             .WithMany(u => u.CartItems)
             .HasForeignKey(c => c.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(c => c.Product)
             .WithMany(p => p.CartItems)
             .HasForeignKey(c => c.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Order
        modelBuilder.Entity<Order>(e =>
        {
            e.Property(o => o.TotalAmount).HasColumnType("decimal(10,2)");
            e.Property(o => o.Status).HasMaxLength(50).HasDefaultValue("Pending");
            e.Property(o => o.ShippingAddress).HasMaxLength(500);
            e.Property(o => o.PaymentMethod).HasMaxLength(50);
            e.Property(o => o.PaymentStatus).HasMaxLength(50);

            e.HasOne(o => o.User)
             .WithMany(u => u.Orders)
             .HasForeignKey(o => o.UserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // OrderItem
        modelBuilder.Entity<OrderItem>(e =>
        {
            e.Property(oi => oi.UnitPrice).HasColumnType("decimal(10,2)");

            e.HasOne(oi => oi.Order)
             .WithMany(o => o.OrderItems)
             .HasForeignKey(oi => oi.OrderId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(oi => oi.Product)
             .WithMany(p => p.OrderItems)
             .HasForeignKey(oi => oi.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Review
        modelBuilder.Entity<Review>(e =>
        {
            e.Property(r => r.Comment).HasMaxLength(1000);

            e.HasOne(r => r.User)
             .WithMany(u => u.Reviews)
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(r => r.Product)
             .WithMany(p => p.Reviews)
             .HasForeignKey(r => r.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Seed Data ────────────────────────────────────────
        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, Name = "Smartphones",  Description = "Mobile phones and accessories" },
            new Category { CategoryId = 2, Name = "Laptops",      Description = "Laptops and notebooks" },
            new Category { CategoryId = 3, Name = "Audio",        Description = "Headphones, speakers, earbuds" },
            new Category { CategoryId = 4, Name = "Tablets",      Description = "Tablets and iPads" },
            new Category { CategoryId = 5, Name = "Accessories",  Description = "Cables, cases, chargers" }
        );

        modelBuilder.Entity<Brand>().HasData(
            new Brand { BrandId = 1, Name = "Apple" },
            new Brand { BrandId = 2, Name = "Samsung" },
            new Brand { BrandId = 3, Name = "Sony" },
            new Brand { BrandId = 4, Name = "Dell" },
            new Brand { BrandId = 5, Name = "OnePlus" },
            new Brand { BrandId = 6, Name = "Bose" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1,  Name = "iPhone 15 Pro",        CategoryId = 1, BrandId = 1, Price = 134900m, Stock = 50,  IsFeatured = true,  SKU = "APL-IP15P",   Description = "Apple iPhone 15 Pro with A17 Pro chip" },
            new Product { ProductId = 2,  Name = "Samsung Galaxy S24",   CategoryId = 1, BrandId = 2, Price = 79999m,  Stock = 80,  IsFeatured = true,  SKU = "SAM-GS24",    Description = "Samsung flagship with AI features" },
            new Product { ProductId = 3,  Name = "MacBook Pro 14",       CategoryId = 2, BrandId = 1, Price = 198900m, Stock = 30,  IsFeatured = true,  SKU = "APL-MBP14",   Description = "Apple MacBook Pro with M3 chip" },
            new Product { ProductId = 4,  Name = "Dell XPS 15",          CategoryId = 2, BrandId = 4, Price = 159999m, Stock = 25,  IsFeatured = false, SKU = "DEL-XPS15",   Description = "Dell XPS 15 premium laptop" },
            new Product { ProductId = 5,  Name = "Sony WH-1000XM5",      CategoryId = 3, BrandId = 3, Price = 29990m,  Stock = 100, IsFeatured = true,  SKU = "SNY-WH1000",  Description = "Industry leading noise cancellation" },
            new Product { ProductId = 6,  Name = "Bose QuietComfort 45", CategoryId = 3, BrandId = 6, Price = 24990m,  Stock = 75,  IsFeatured = false, SKU = "BSE-QC45",    Description = "Bose premium noise cancelling headphones" },
            new Product { ProductId = 7,  Name = "iPad Pro 12.9",        CategoryId = 4, BrandId = 1, Price = 112900m, Stock = 40,  IsFeatured = true,  SKU = "APL-IPADP12", Description = "Apple iPad Pro with M2 chip" },
            new Product { ProductId = 8,  Name = "Samsung Galaxy Tab S9",CategoryId = 4, BrandId = 2, Price = 72999m,  Stock = 35,  IsFeatured = false, SKU = "SAM-TABS9",   Description = "Samsung premium Android tablet" },
            new Product { ProductId = 9,  Name = "OnePlus 12",           CategoryId = 1, BrandId = 5, Price = 64999m,  Stock = 60,  IsFeatured = false, SKU = "OP-12",       Description = "OnePlus flagship with Snapdragon 8 Gen 3" },
            new Product { ProductId = 10, Name = "Apple USB-C Cable",    CategoryId = 5, BrandId = 1, Price = 1900m,   Stock = 500, IsFeatured = false, SKU = "APL-USBC",    Description = "Apple official USB-C braided cable" }
        );
    }
}