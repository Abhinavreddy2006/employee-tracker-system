import express from "express";
import {
    createTask,
    getMyTasks,
    updateTaskStatus,
    getOverdueTasks,
    getProductivityScore,
    getTaskStats,
    getLeaderboard,
    getAllTasks,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes MUST come before /:id
router.get("/mytasks", protect, getMyTasks);
router.get("/stats", protect, adminOnly, getTaskStats);
router.get("/productivity", protect, getProductivityScore);
router.get("/leaderboard", protect, adminOnly, getLeaderboard);
router.get("/overdue", protect, getOverdueTasks);

// General routes
router.post("/", protect, adminOnly, createTask);
router.get("/", protect, adminOnly, getAllTasks);
router.patch("/:id", protect, updateTaskStatus);

export default router;
