import express from "express";

import {
    markAttendance,
    getMyAttendance,
    getAttendanceStats,
} from "../controllers/attendanceController.js";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();



// MARK ATTENDANCE
router.post(
    "/mark",
    protect,
    markAttendance
);



// GET ATTENDANCE
router.get(
    "/myattendance",
    protect,
    getMyAttendance
);

router.get(
    "/stats",
    protect,
    adminOnly,
    getAttendanceStats
);

export default router;