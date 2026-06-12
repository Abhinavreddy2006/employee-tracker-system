import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getEmployees, deleteEmployee, getEmployeeStats } from "../controllers/employeeController.js";

const router = express.Router();

// Specific routes BEFORE /:id to avoid conflicts
router.get("/stats", protect, adminOnly, getEmployeeStats);
router.get("/",      protect, adminOnly, getEmployees);
router.delete("/:id", protect, adminOnly, deleteEmployee);

export default router;
