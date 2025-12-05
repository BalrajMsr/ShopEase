import express from "express";
import {
    getWishlistByUser,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    countWhishlistItems
} from "../controllers/wishListController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getWishlistByUser);
router.post("/add", protect, addToWishlist);
router.post("/remove", protect, removeFromWishlist);
router.post("/clear", protect, clearWishlist);
router.get("/count", protect, countWhishlistItems);

export default router;