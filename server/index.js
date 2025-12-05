import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import wishListRoutes from "./routes/wishList.js";
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => res.send("ShopEase API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));