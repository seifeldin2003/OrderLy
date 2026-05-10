# Customer Ordering System (COS) - Project Documentation

A full-stack web application for managing customer orders, built with FastAPI (backend) and React/TypeScript (frontend).

## Project Overview

This is a restaurant ordering system that allows customers to browse menus, add items to cart, place orders, and track them. Admins can manage menu items, view orders, and handle order statuses.

### Features
- **Customer Features**: Browse menu, add to cart, place orders, track orders
- **Admin Features**: Manage menu items, view orders, update order status
- **Authentication**: JWT-based login for customers and admins
- **Database**: SQLite with SQLAlchemy and Alembic migrations

### Tech Stack
- **Backend**: FastAPI, SQLAlchemy, Alembic, Pydantic
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: SQLite
- **Authentication**: JWT tokens

## File Structure

### Root Directory
- `index.html` - Basic HTML entry point
- `package.json` - Frontend dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `README.md` - This file

### Backend (`backend/`)
- `requirements.txt` - Python dependencies
- `alembic.ini` - Alembic migration configuration
- `alembic/` - Database migration scripts
  - `env.py` - Migration environment
  - `versions/` - Migration files
- `app/` - Main application code
  - `__init__.py`
  - `main.py` - FastAPI app entry point
  - `seed.py` - Database seeding script
  - `core/` - Core functionality
    - `config.py` - App configuration (database URL, JWT settings)
    - `database.py` - Database connection
    - `dependencies.py` - Dependency injection
    - `security.py` - JWT authentication
  - `models/` - SQLAlchemy models
    - `user.py` - User model
    - `menu_item.py` - Menu item model
    - `order.py` - Order model
    - `cart.py` - Cart model
  - `schemas/` - Pydantic schemas for API
    - `user.py` - User schemas
    - `menu.py` - Menu schemas
    - `order.py` - Order schemas
    - `cart.py` - Cart schemas
    - `auth.py` - Authentication schemas
    - `admin.py` - Admin dashboard schemas
  - `services/` - Business logic
    - `user_service.py` - User operations
    - `menu_service.py` - Menu operations
    - `cart_service.py` - Cart operations
    - `order_service.py` - Order operations
    - `admin_service.py` - Admin operations
  - `repositories/` - Data access layer
    - `user_repository.py` - User database operations
    - `menu_repository.py` - Menu database operations
    - `cart_repository.py` - Cart database operations
    - `order_repository.py` - Order database operations
  - `api/` - API routes
    - `router.py` - Main router
    - `routes/` - Route modules
      - `auth.py` - Authentication endpoints
      - `menu.py` - Menu endpoints
      - `cart.py` - Cart endpoints
      - `orders.py` - Order endpoints
      - `admin.py` - Admin endpoints
  - `tests/` - Unit tests
- `customer_ordering_api.db` - SQLite database file
- `.env` - Environment variables (database URL, JWT secret)

### Frontend (`src/`)
- `main.tsx` - React app entry point
- `index.css` - Global styles
- `vite-env.d.ts` - Vite type definitions
- `app/` - Main app components
  - `App.tsx` - Root component
  - `router.tsx` - React Router configuration
- `components/` - Reusable UI components
  - `common/` - Shared components (Button, Input, Modal, etc.)
  - `layout/` - Layout components (Header, Footer)
  - `menu/` - Menu-related components (FoodCard, FoodDetailsModal, MenuFilters)
  - `cart/` - Cart components (CartItemRow)
  - `orders/` - Order components (OrderDetailsCard)
  - `admin/` - Admin components (MenuItemForm, AdminMenuTable)
- `pages/` - Page components
  - `auth/` - Authentication pages (LoginPage, RegisterPage, WelcomePage)
  - `customer/` - Customer pages (HomePage, MenuPage, CartPage, OrdersPage, TrackOrderPage)
  - `admin/` - Admin pages (AdminDashboardPage, AdminMenuPage, AdminOrdersPage)
- `services/` - API client and data services
  - `apiClient.ts` - Axios HTTP client
  - `authService.ts` - Authentication API calls
  - `menuService.ts` - Menu API calls
  - `cartService.ts` - Cart API calls
  - `orderService.ts` - Order API calls
  - `adminService.ts` - Admin API calls
  - `mockData.ts` - Mock data for development
- `store/` - State management (Zustand stores)
  - `authStore.ts` - Authentication state
  - `cartStore.ts` - Cart state
  - `orderStore.ts` - Order state
- `types/` - TypeScript type definitions
  - `auth.ts` - Auth types
  - `menu.ts` - Menu types
  - `cart.ts` - Cart types
  - `order.ts` - Order types
  - `admin.ts` - Admin types
- `utils/` - Utility functions
  - `currency.ts` - Currency formatting
  - `date.ts` - Date formatting
  - `orderStatus.ts` - Order status utilities
  - `validation.ts` - Form validation

### Docs (`docs/`)
- `api_contracts.md` - API documentation
- `architecture.md` - System architecture overview

## Setup and Running the Project

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd COS
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Run migrations
alembic upgrade head

# Seed with demo data
python -m app.seed
```

### 4. Frontend Setup
```bash
# Back to root
cd ..
npm install
```

### 5. Run the Application
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
npm run dev
```

### 6. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Demo Credentials
- **Admin**: admin@example.com / admin123
- **Customer**: customer@example.com / customer123

## Development Workflow

### Database Changes
1. Modify models in `backend/app/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Apply migration: `alembic upgrade head`

### Adding Features
1. Backend: Add routes in `api/routes/`, services in `services/`, schemas in `schemas/`
2. Frontend: Add components in `components/`, pages in `pages/`, API calls in `services/`
3. Update types in `types/` and state in `store/`

### Testing
```bash
cd backend
pytest
```

## Key Components Explained

### Backend Architecture
- **FastAPI**: Web framework for API endpoints
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migration tool
- **Pydantic**: Data validation and serialization
- **JWT**: Token-based authentication

### Frontend Architecture
- **React**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing

### Database Schema
- **Users**: Customer and admin accounts
- **Menu Items**: Food items with categories, prices, images
- **Carts**: Shopping carts for users
- **Orders**: Order history with status tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu/items` - Get menu items (with filters)
- `GET /api/menu/items/{id}` - Get single menu item

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/menu` - Get all menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/{id}` - Update menu item
- `DELETE /api/admin/menu/{id}` - Delete menu item
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/status` - Update order status

## Deployment

### Backend
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
npm run build
# Serve dist/ with any static server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

MIT License