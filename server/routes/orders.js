import express from "express";
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id", protect, admin, updateOrderStatus);

export default router;