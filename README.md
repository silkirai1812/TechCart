# ⚡ TechCart — B2C Electronics Store
A full-stack B2C e-commerce application for electronics built with **ASP.NET Core 8 Web API** and **React + Vite + TailwindCSS**. Features JWT authentication, shopping cart, order management, product reviews, and a complete admin dashboard.

---

## 🖥️ Live Demo

> Frontend: 
> Backend API: 

---

## ✨ Features

### Customer Features
- 🔐 Register and login with JWT authentication
- 🛍️ Browse products with search, filter and pagination
- 🔍 Filter by category, brand, price range
- 📱 Product detail page with specifications and reviews
- ⭐ Add product reviews and ratings (1–5 stars)
- 🛒 Shopping cart — add, update quantity, remove items
- 📦 Place orders with shipping address and payment method
- 📋 View order history and order details
- 📱 Fully responsive — works on mobile and desktop

### Admin Features
- 📊 Admin dashboard with stats overview
- ➕ Add, edit, delete products
- 🏷️ Manage categories and brands
- 📦 View all orders and update order status
- 🔒 Role-based access control (Admin / Customer)

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| ASP.NET Core | 8.0 | Web API framework |
| Entity Framework Core | 8.0 | ORM for database access |
| SQL Server 2022 | Latest | Relational database |
| JWT Bearer | 8.0 | Authentication and authorization |
| BCrypt.Net | 4.0.3 | Password hashing |
| Swagger / OpenAPI | 6.5 | API documentation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI library |
| Vite | 5 | Build tool and dev server |
| TailwindCSS | 3 | Utility-first CSS framework |
| React Router | 6 | Client-side routing |
| Axios | Latest | HTTP client |
| React Hot Toast | Latest | Toast notifications |
| React Icons | Latest | Icon library |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Docker | Runs SQL Server locally on Mac/Linux |
| Git | Version control |

---

## 📁 Project Structure

```
TechCart/
├── backend/
│   └── TechCartAPI/
│       ├── Controllers/          # API endpoints
│       │   ├── AuthController.cs
│       │   ├── ProductsController.cs
│       │   ├── CategoriesController.cs
│       │   ├── BrandsController.cs
│       │   ├── CartController.cs
│       │   ├── OrdersController.cs
│       │   └── ReviewsController.cs
│       ├── Data/
│       │   └── TechCartContext.cs  # EF Core DbContext + seed data
│       ├── DTOs/                   # Data Transfer Objects
│       │   ├── AuthDTOs.cs
│       │   ├── ProductDTOs.cs
│       │   ├── CartDTOs.cs
│       │   ├── OrderDTOs.cs
│       │   └── ReviewDTOs.cs
│       ├── Models/                 # Entity classes
│       │   ├── User.cs
│       │   ├── Product.cs
│       │   ├── Category.cs
│       │   ├── Brand.cs
│       │   ├── Order.cs
│       │   ├── OrderItem.cs
│       │   ├── CartItem.cs
│       │   └── Review.cs
│       ├── Services/
│       │   └── TokenService.cs     # JWT token generation
│       ├── Migrations/             # EF Core migrations
│       ├── appsettings.json        # Configuration
│       └── Program.cs              # App entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProductCard.jsx
        │   └── LoadingSpinner.jsx
        ├── context/
        │   ├── AuthContext.jsx     # Global auth state
        │   └── CartContext.jsx     # Global cart state
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ProductsPage.jsx
        │   ├── ProductDetailPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── CartPage.jsx
        │   ├── OrdersPage.jsx
        │   └── AdminPage.jsx
        ├── services/
        │   └── api.js              # Axios API service layer
        └── App.jsx                 # Routes and providers
```

---

## 🗄️ Database Schema

```
Users ──────────────────────────────────────────────────────┐
│ UserId, FirstName, LastName, Email, PasswordHash, Role     │
└──────────────────────────────────────────────────────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
      Orders                      CartItems ──── Products
         │                                           │
         │ 1:N                                       │
         ▼                                     ┌─────┴──────┐
      OrderItems ──── Products            Categories    Brands
                                               │
                                          Reviews ──── Users
```

### Tables
- **Users** — customer and admin accounts
- **Products** — electronics catalog with pricing, stock, specs
- **Categories** — Smartphones, Laptops, Audio, Tablets, Accessories
- **Brands** — Apple, Samsung, Sony, Dell, OnePlus, Bose
- **Orders** — customer orders with status tracking
- **OrderItems** — line items per order
- **CartItems** — persistent shopping cart per user
- **Reviews** — product reviews with 1-5 star ratings

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js v20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/silkirai1812/TechCart
cd TechCart
```

---

### 2. Set Up SQL Server (via Docker)

```bash
# Pull and run SQL Server 2022
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=Train1234Abc" \
  -p 1433:1433 \
  --name sqlserver2022 \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Verify it's running
docker ps
```

---

### 3. Run the Backend

```bash
cd backend/TechCartAPI

# Restore packages
dotnet restore

# Install EF Core CLI (if not already installed)
dotnet tool install --global dotnet-ef

# Apply migrations and seed database
dotnet ef database update

# Run the API
dotnet run
```

API will start at: `http://localhost:5144`
Swagger UI: `http://localhost:5144/swagger`

---

### 4. Run the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

### 5. Create Admin User

After registering an account, promote it to Admin:

```bash
docker exec -it sqlserver2022 /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U SA -P "Train1234Abc" -No \
  -Q "USE TechCartDB; UPDATE Users SET Role = 'Admin' WHERE Email = 'your@email.com';"
```

Log out and log back in to see the Admin panel.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products (filter, search, paginate) | ❌ |
| GET | `/api/products/{id}` | Get product by ID with reviews | ❌ |
| POST | `/api/products` | Create product | 🔐 Admin |
| PUT | `/api/products/{id}` | Update product | 🔐 Admin |
| DELETE | `/api/products/{id}` | Soft delete product | 🔐 Admin |

### Categories & Brands
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | ❌ |
| POST | `/api/categories` | Create category | 🔐 Admin |
| GET | `/api/brands` | Get all brands | ❌ |
| POST | `/api/brands` | Create brand | 🔐 Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get user's cart | 🔐 User |
| POST | `/api/cart` | Add item to cart | 🔐 User |
| PUT | `/api/cart` | Update cart item quantity | 🔐 User |
| DELETE | `/api/cart/{id}` | Remove cart item | 🔐 User |
| DELETE | `/api/cart/clear` | Clear entire cart | 🔐 User |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Get my orders | 🔐 User |
| GET | `/api/orders/{id}` | Get order by ID | 🔐 User |
| POST | `/api/orders` | Place order from cart | 🔐 User |
| PUT | `/api/orders/{id}/status` | Update order status | 🔐 Admin |
| GET | `/api/orders/admin/all` | Get all orders | 🔐 Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews/product/{id}` | Get product reviews | ❌ |
| POST | `/api/reviews` | Add review | 🔐 User |
| DELETE | `/api/reviews/{id}` | Delete review | 🔐 User/Admin |

---

## ⚙️ Configuration

### Backend — `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1,1433;Database=TechCartDB;User Id=SA;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyHere",
    "Issuer": "TechCartAPI",
    "Audience": "TechCartClient",
    "ExpiryInMinutes": 60
  }
}
```

### Frontend — `src/services/api.js`

```js
const API_BASE = 'http://localhost:5144/api'; // change for production
```

---

## 🔐 Authentication Flow

```
User submits login credentials
        ↓
Backend validates email + BCrypt password hash
        ↓
JWT token generated with claims (userId, email, role)
        ↓
Token returned to frontend
        ↓
Frontend stores token in localStorage
        ↓
All subsequent requests include: Authorization: Bearer {token}
        ↓
Backend validates token on every protected endpoint
```

---

## 🌱 Seed Data

The database is pre-seeded with:

**Categories:** Smartphones, Laptops, Audio, Tablets, Accessories

**Brands:** Apple, Samsung, Sony, Dell, OnePlus, Bose

**Products (10):**
| Product | Brand | Price |
|---------|-------|-------|
| iPhone 15 Pro | Apple | ₹1,34,900 |
| Samsung Galaxy S24 | Samsung | ₹79,999 |
| MacBook Pro 14 | Apple | ₹1,98,900 |
| Dell XPS 15 | Dell | ₹1,59,999 |
| Sony WH-1000XM5 | Sony | ₹29,990 |
| Bose QuietComfort 45 | Bose | ₹24,990 |
| iPad Pro 12.9 | Apple | ₹1,12,900 |
| Samsung Galaxy Tab S9 | Samsung | ₹72,999 |
| OnePlus 12 | OnePlus | ₹64,999 |
| Apple USB-C Cable | Apple | ₹1,900 |

---

## 🧠 Key Design Decisions

**Why DTOs?**
Entity models are never exposed directly to the API. DTOs control exactly what data goes in and out — prevents over-posting, sensitive data leakage, and circular reference issues.

**Why Soft Delete?**
Products are never hard-deleted. Setting `IsActive = false` preserves order history integrity — you can't delete a product that exists in past orders.

**Why JWT over Sessions?**
JWT is stateless — the server doesn't store session data. Scales better, works across multiple servers, and is the industry standard for REST APIs.

**Why EF Core over raw SQL?**
Type safety, migration management, LINQ queries, and faster development. Raw SQL is used only when EF Core queries are insufficient.

---

## 📝 Environment Variables (Production)

For production deployment, use environment variables instead of appsettings.json:

```bash
# Backend
CONNECTIONSTRINGS__DEFAULTCONNECTION="Server=...;Database=TechCartDB;..."
JWT__KEY="YourProductionSecretKey"
JWT__ISSUER="TechCartAPI"
JWT__AUDIENCE="TechCartClient"

# Frontend (.env)
VITE_API_BASE=https://your-api-url.com/api
```

---

## 🚢 Deployment

### Backend → Railway / Azure App Service
### Frontend → Vercel
### Database → Azure SQL / Railway PostgreSQL

See [Deployment Guide](#) for step-by-step instructions.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- [Microsoft ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)