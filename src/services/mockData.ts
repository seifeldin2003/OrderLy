import type { MenuItem } from "../types/menu";
import type { Order } from "../types/order";

export const mockMenuItems: MenuItem[] = [
  {
    id: "pizza-margherita",
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Stone-baked pizza with tomato, mozzarella, basil, and olive oil.",
    price: 13.5,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    stock: 22,
    available: true,
  },
  {
    id: "truffle-burger",
    name: "Gourmet Truffle Burger",
    category: "Burgers",
    description: "Beef patty, truffle aioli, caramelized onions, cheddar, and brioche.",
    price: 16.25,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    stock: 15,
    available: true,
  },
  {
    id: "alfredo-pasta",
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    description: "Fettuccine tossed with parmesan cream sauce and grilled chicken.",
    price: 14.75,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    available: true,
  },
  {
    id: "berry-lemonade",
    name: "Berry Lemonade",
    category: "Drinks",
    description: "Fresh lemon, mixed berries, mint, and sparkling water.",
    price: 4.5,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
    stock: 40,
    available: true,
  },
  {
    id: "chocolate-lava",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    description: "Warm chocolate cake with a molten center and vanilla cream.",
    price: 7.25,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    available: true,
  },
  {
    id: "pepperoni-pizza",
    name: "Pepperoni Feast",
    category: "Pizza",
    description: "Crisp pepperoni, mozzarella, oregano, and rich tomato sauce.",
    price: 15,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    stock: 20,
    available: true,
  },
];

export const mockOrders: Order[] = [];
