import express from "express";

import {
    markAttendance,
    getMyAttendance,
} from "../controllers/attendanceController.js";

import {
    protect,
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

export default router;