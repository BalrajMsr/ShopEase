import express from "express";
import {
    getUserById,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    allUserCount,
    adminUserStats,
    updateUserRole,
    getDashboardStats,
    updatePassword,
    deleteMyAccount
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, updatePassword);
router.delete("/me", protect, deleteMyAccount);
router.get("/", protect, admin, getAllUsers);
router.get("/stats", protect, admin, adminUserStats);
router.get("/count", protect, admin, allUserCount);
router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.get("/:id", protect, admin, getUserById);
router.delete("/:id", protect, admin, deleteUser);
router.patch("/:id/role", protect, admin, updateUserRole);

export default router;