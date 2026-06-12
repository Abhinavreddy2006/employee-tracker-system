import express from "express";
import { markAttendance, getMyAttendance, getEmployeeAttendance, getAllAttendance, getAttendanceStats } from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark",              protect,            markAttendance);
router.get("/myattendance",       protect,            getMyAttendance);
router.get("/all",                protect, adminOnly, getAllAttendance);
router.get("/stats",              protect, adminOnly, getAttendanceStats);
router.get("/employee/:id",       protect, adminOnly, getEmployeeAttendance);  // NEW

export default router;
