import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: { type: String, default: "pending" },
  orderStatus: { type: String, default: "pending" }, // pending, processing, shipped, delivered
  shippingAddress: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);