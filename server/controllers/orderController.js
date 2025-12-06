import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body; // products: [{ product, quantity }]
    let total = 0;

    // 1. Validate stock and calculate total
    for (const p of products) {
      const prod = await Product.findById(p.product);
      if (!prod) {
        return res.status(404).json({ message: `Product not found: ${p.product}` });
      }
      if (prod.stock < p.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      }
      total += prod.price * p.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount: total,
      shippingAddress,
      paymentStatus: req.body.paymentStatus || "pending",
      paymentIntentId: req.body.paymentIntentId
    });

    // 2. Decrement Stock
    for (const p of products) {
      await Product.findByIdAndUpdate(p.product, {
        $inc: { stock: -p.quantity }
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name email");
    await updatedOrder.populate("products.product");

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { products } = req.body;
    let total = 0;

    for (const p of products) {
      const prod = await Product.findById(p.product);
      if (prod) {
        total += prod.price * p.quantity;
      }
    }

    // Add shipping and tax logic (sync with frontend)
    const shipping = total > 500 ? 0 : 50;
    const tax = total * 0.18;
    const grandTotal = total + shipping + tax;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100), // amount in cents
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check ownership or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Check status
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      return res.status(400).json({ message: "Cannot cancel order that is already " + order.orderStatus });
    }

    order.orderStatus = 'cancelled';
    const updatedOrder = await order.save();

    // Restore Stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await updatedOrder.populate("user", "name email");
    await updatedOrder.populate("products.product");

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};