import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body; // products: [{ product, quantity }]
    let total = 0;
    for (const p of products) {
      const prod = await Product.findById(p.product);
      total += prod.price * p.quantity;
    }
    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount: total,
      shippingAddress,
      paymentStatus: "paid", // for demo we assume paid
    });
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