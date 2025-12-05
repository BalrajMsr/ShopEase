import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  await Product.deleteMany({});
  await User.deleteMany({});
  const products = [
    // --- ORIGINAL LIST (1-16) ---
    {
      id: 1,
      name: "Women's Summer Dress",
      price: "59.99",
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      price: "179.99",
      images: [
        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 3,
      name: "Running Shoes",
      price: "129.99",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
      ],
      category: "Footwear"
    },
    {
      id: 4,
      name: "Travel Backpack",
      price: "79.99",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Accessories"
    },
    {
      id: 5,
      name: "Gaming Console",
      price: "499.99",
      images: [
        "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 6,
      name: "Men's Leather Boots",
      price: "159.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1728158949987-efc83ed54df4?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Footwear"
    },
    {
      id: 7,
      name: "Smart LED Table Lamp",
      price: "49.99",
      images: [
        "https://images.unsplash.com/photo-1587299071599-a815c057393c?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Home & Living"
    },
    {
      id: 8,
      name: "Premium Hoodie",
      price: "69.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1673356302125-c77491af8735?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Clothing"
    },
    {
      id: 9,
      name: "Professional Camera",
      price: "899.99",
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 10,
      name: "Premium Wireless Headphones",
      price: "299.99",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 11,
      name: "Smart Coffee Maker",
      price: "199.99",
      images: [
        "https://images.unsplash.com/photo-1565452344518-47faca79dc69?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 12,
      name: "Ultra-Thin Laptop",
      price: "1299.99",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 13,
      name: "Men's Casual Denim Jacket",
      price: "89.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1661385952395-71e073544e20?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 14,
      name: "Smart Watch Pro",
      price: "449.99",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Electronics"
    },
    {
      id: 15,
      name: "Women's Sport Sneakers",
      price: "139.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1663127744356-9e4302170858?w=1000&auto=format&fit=crop"
      ],
      category: "Footwear"
    },
    {
      id: 16,
      name: "Leather Wallet",
      price: "39.99",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&auto=format&fit=crop&q=60"
      ],
      category: "Accessories"
    },

    // --- NEW ADDITIONS (17-52) ---

    // ELECTRONICS
    {
      id: 17,
      name: "Mechanical Keyboard",
      price: "149.99",
      images: [
        "https://images.unsplash.com/photo-1595225476474-87563907a212?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 18,
      name: "Portable Bluetooth Speaker",
      price: "59.99",
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 19,
      name: "4K Action Camera",
      price: "249.99",
      images: [
        "https://images.unsplash.com/photo-1705107958312-bd94ca0029bd?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 20,
      name: "VR Headset",
      price: "349.99",
      images: [
        "https://images.unsplash.com/photo-1707228773518-7ca0492d0c4d?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 21,
      name: "Drone with Camera",
      price: "799.99",
      images: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },
    {
      id: 22,
      name: "Gaming Mouse",
      price: "49.99",
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1000&auto=format&fit=crop"
      ],
      category: "Electronics"
    },

    // CLOTHING
    {
      id: 23,
      name: "Classic Beige Trench Coat",
      price: "199.99",
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 24,
      name: "Cotton Crew Neck T-Shirt",
      price: "24.99",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 25,
      name: "High-Waist Yoga Leggings",
      price: "45.99",
      images: [
        "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 26,
      name: "Men's Formal Suit",
      price: "299.99",
      images: [
        "https://images.unsplash.com/photo-1695857605560-86f73d3ba09d?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 27,
      name: "Knitted Winter Sweater",
      price: "79.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1661696324797-7beaaeefdbba?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },
    {
      id: 28,
      name: "Silk Scarf",
      price: "34.99",
      images: [
        "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=1000&auto=format&fit=crop"
      ],
      category: "Clothing"
    },

    // HOME & LIVING
    {
      id: 29,
      name: "Ceramic Plant Pot",
      price: "29.99",
      images: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 30,
      name: "Scented Soy Candle",
      price: "24.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1663853120820-11e9cfaf3121?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 31,
      name: "Modern Wall Clock",
      price: "59.99",
      images: [
        "https://images.unsplash.com/photo-1614447414011-2f031ef08d05?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 32,
      name: "Soft Throw Blanket",
      price: "49.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1763466939888-08f4e33547a9?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 33,
      name: "Chef's Knife Set",
      price: "129.99",
      images: [
        "https://images.unsplash.com/photo-1609467334293-030ac6448fd8?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },
    {
      id: 34,
      name: "Glass Water Carafe",
      price: "34.99",
      images: [
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1000&auto=format&fit=crop"
      ],
      category: "Home & Living"
    },

    // ACCESSORIES
    {
      id: 35,
      name: "Aviator Sunglasses",
      price: "129.99",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },
    {
      id: 36,
      name: "Luxury Wrist Watch",
      price: "249.99",
      images: [
        "https://images.unsplash.com/photo-1763299213167-0c5ebc1e6d96?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },
    {
      id: 37,
      name: "Leather Crossbody Bag",
      price: "119.99",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },
    {
      id: 38,
      name: "Gold Plated Necklace",
      price: "89.99",
      images: [
        "https://images.unsplash.com/photo-1731406322264-dac59f83828b?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },
    {
      id: 39,
      name: "Canvas Tote Bag",
      price: "29.99",
      images: [
        "https://plus.unsplash.com/premium_photo-1726837248441-6162192d602d?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },
    {
      id: 40,
      name: "Leather Belt",
      price: "45.99",
      images: [
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1000&auto=format&fit=crop"
      ],
      category: "Accessories"
    },

    // BEAUTY & PERSONAL CARE
    {
      id: 41,
      name: "Hydrating Face Serum",
      price: "39.99",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop"
      ],
      category: "Beauty"
    },
    {
      id: 42,
      name: "Matte Lipstick Set",
      price: "34.99",
      images: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop"
      ],
      category: "Beauty"
    },
    {
      id: 43,
      name: "Organic Shampoo",
      price: "19.99",
      images: [
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000&auto=format&fit=crop"
      ],
      category: "Beauty"
    },
    {
      id: 44,
      name: "Makeup Brush Set",
      price: "29.99",
      images: [
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=1000&auto=format&fit=crop"
      ],
      category: "Beauty"
    },
    {
      id: 45,
      name: "Electric Shaver",
      price: "69.99",
      images: [
        "https://images.unsplash.com/photo-1621607512214-68297480165e?w=1000&auto=format&fit=crop"
      ],
      category: "Beauty"
    },

    // SPORTS & OUTDOORS
    {
      id: 46,
      name: "Yoga Mat",
      price: "29.99",
      images: [
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 47,
      name: "Stainless Steel Water Bottle",
      price: "24.99",
      images: [
        "https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 48,
      name: "Tennis Racket",
      price: "159.99",
      images: [
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 49,
      name: "Adjustable Dumbbells",
      price: "199.99",
      images: [
        "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 50,
      name: "Skateboard",
      price: "89.99",
      images: [
        "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 51,
      name: "Camping Tent",
      price: "149.99",
      images: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    },
    {
      id: 52,
      name: "Hiking Backpack",
      price: "119.99",
      images: [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&auto=format&fit=crop"
      ],
      category: "Sports"
    }
  ];

  for (const product of products) {
    delete product.id; // Remove id to avoid duplication issues
    const existingProduct = await Product.findOne({ name: product.name });
    if (existingProduct) {
      await Product.updateOne({ name: product.name }, product);
    } else {
      await Product.create(product);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("admin123", salt);
  await User.create({ name: "Admin", email: "admin@shopease.test", password: hash, role: "admin", address: "123 Admin St, Admin City, Admin Country", phoneNumber: "123-456-7890", emailVerified: true, city: "Admin City", state: "Admin State", zipCode: "12345" });

  console.log("Seeded");
  process.exit();
}

seed();