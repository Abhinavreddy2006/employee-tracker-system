import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",              protect, getNotifications);
router.patch("/markallread", protect, markAllAsRead);  // MUST be before /:id
router.patch("/:id/read",    protect, markAsRead);

export default router;
