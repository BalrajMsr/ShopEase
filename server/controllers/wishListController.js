import Wishlist from "../models/Wishlist.js";

export const getWishlistByUser = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    console.log("Adding product to wishlist:", product);
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }   
    if (!wishlist.products.includes(product._id)) {
      wishlist.products.push(product);
      await wishlist.save();
    }
    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.products = wishlist.products.filter(
      (productId) => productId.toString() !== req.body.productId
    );
    await wishlist.save();
    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.products = [];
    await wishlist.save();
    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const countWhishlistItems = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const itemCount = wishlist ? wishlist.products.length : 0;
    res.json({ itemCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};