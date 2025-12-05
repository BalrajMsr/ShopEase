import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = quantity;
            cart.items[existingItemIndex].price = product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get cart item count
export const getCartCount = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const itemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        res.json({ itemCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
