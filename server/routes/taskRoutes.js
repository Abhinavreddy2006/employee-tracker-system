import express from "express";

import {
    createTask,
    getMyTasks,
    updateTaskStatus,
    getTaskStats,
} from "../controllers/taskController.js";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();



// ADMIN CREATE TASK
router.post(
    "/",
    protect,
    adminOnly,
    createTask
);



// EMPLOYEE GET TASKS
router.get(
    "/mytasks",
    protect,
    getMyTasks
);

router.patch(
    "/:id",
    protect,
    updateTaskStatus
);

router.get(
    "/stats",
    protect,
    adminOnly,
    getTaskStats
);

export default router;