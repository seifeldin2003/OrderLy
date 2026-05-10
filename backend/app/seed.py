"""
Seed script to populate the database with sample data.
Run this after setting up the database and migrations.

Usage:
    python -m app.seed
"""

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.menu_item import MenuItem

def seed_database():
    """Insert sample data into the database."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if data already exists (don't re-seed)
        if db.query(User).first() is not None:
            print("Database already seeded. Skipping...")
            return
        
        # ===== USERS =====
        admin_user = User(
            full_name="Admin User",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            phone="01000000001",
            address="123 Admin Street",
            role="admin",
            is_active=True
        )
        
        customer_user = User(
            full_name="Test Customer",
            email="customer@example.com",
            password_hash=get_password_hash("customer123"),
            phone="01000000002",
            address="456 Customer Avenue",
            role="customer",
            is_active=True
        )
        
        db.add(admin_user)
        db.add(customer_user)
        db.commit()
        
        print("Added 2 users (admin + customer)")
        
        # ===== MENU ITEMS =====
        menu_items = [
            # Pizza
            MenuItem(
                name="Margherita Pizza",
                category="Pizza",
                description="Fresh mozzarella, basil, tomato sauce",
                price=8.99,
                image_url="https://via.placeholder.com/300?text=Margherita+Pizza",
                stock=20,
                available=True
            ),
            MenuItem(
                name="Pepperoni Pizza",
                category="Pizza",
                description="Classic pepperoni with mozzarella cheese",
                price=9.99,
                image_url="https://via.placeholder.com/300?text=Pepperoni+Pizza",
                stock=18,
                available=True
            ),
            MenuItem(
                name="Vegetarian Pizza",
                category="Pizza",
                description="Bell peppers, onions, mushrooms, olives",
                price=8.49,
                image_url="https://via.placeholder.com/300?text=Vegetarian+Pizza",
                stock=15,
                available=True
            ),
            
            # Burgers
            MenuItem(
                name="Classic Cheeseburger",
                category="Burgers",
                description="Beef patty, cheddar cheese, lettuce, tomato",
                price=7.99,
                image_url="https://via.placeholder.com/300?text=Cheeseburger",
                stock=25,
                available=True
            ),
            MenuItem(
                name="Bacon Burger",
                category="Burgers",
                description="Crispy bacon, beef patty, special sauce",
                price=8.99,
                image_url="https://via.placeholder.com/300?text=Bacon+Burger",
                stock=20,
                available=True
            ),
            MenuItem(
                name="Double Burger",
                category="Burgers",
                description="Two beef patties, double cheese, all the toppings",
                price=10.99,
                image_url="https://via.placeholder.com/300?text=Double+Burger",
                stock=15,
                available=True
            ),
            
            # Pasta
            MenuItem(
                name="Spaghetti Carbonara",
                category="Pasta",
                description="Creamy sauce with bacon and parmesan",
                price=9.49,
                image_url="https://via.placeholder.com/300?text=Spaghetti+Carbonara",
                stock=12,
                available=True
            ),
            MenuItem(
                name="Penne Arrabbiata",
                category="Pasta",
                description="Spicy tomato sauce with garlic and chili",
                price=8.99,
                image_url="https://via.placeholder.com/300?text=Penne+Arrabbiata",
                stock=10,
                available=True
            ),
            MenuItem(
                name="Alfredo Pasta",
                category="Pasta",
                description="Creamy parmesan sauce with fettuccine",
                price=9.99,
                image_url="https://via.placeholder.com/300?text=Alfredo+Pasta",
                stock=14,
                available=True
            ),
            
            # Drinks
            MenuItem(
                name="Coca Cola",
                category="Drinks",
                description="Classic refreshing cola",
                price=1.99,
                image_url="https://via.placeholder.com/300?text=Coca+Cola",
                stock=50,
                available=True
            ),
            MenuItem(
                name="Fresh Orange Juice",
                category="Drinks",
                description="100% fresh squeezed orange juice",
                price=2.99,
                image_url="https://via.placeholder.com/300?text=Orange+Juice",
                stock=30,
                available=True
            ),
            MenuItem(
                name="Iced Tea",
                category="Drinks",
                description="Refreshing iced tea with lemon",
                price=1.49,
                image_url="https://via.placeholder.com/300?text=Iced+Tea",
                stock=40,
                available=True
            ),
            
            # Desserts
            MenuItem(
                name="Chocolate Cake",
                category="Desserts",
                description="Rich chocolate cake with frosting",
                price=4.99,
                image_url="https://via.placeholder.com/300?text=Chocolate+Cake",
                stock=8,
                available=True
            ),
            MenuItem(
                name="Tiramisu",
                category="Desserts",
                description="Classic Italian dessert with mascarpone",
                price=5.99,
                image_url="https://via.placeholder.com/300?text=Tiramisu",
                stock=6,
                available=True
            ),
            MenuItem(
                name="Ice Cream Sundae",
                category="Desserts",
                description="Vanilla ice cream with chocolate sauce and toppings",
                price=3.99,
                image_url="https://via.placeholder.com/300?text=Ice+Cream+Sundae",
                stock=20,
                available=True
            ),
            MenuItem(
                name="Cheesecake",
                category="Desserts",
                description="New York style cheesecake",
                price=4.49,
                image_url="https://via.placeholder.com/300?text=Cheesecake",
                stock=5,
                available=True
            ),
        ]
        
        db.add_all(menu_items)
        db.commit()
        
        print("Added 16 menu items (Pizza, Burgers, Pasta, Drinks, Desserts)")
        print("\nDatabase seeded successfully!")
        print("\nDemo Credentials:")
        print("  Admin:    admin@example.com / admin123")
        print("  Customer: customer@example.com / customer123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
