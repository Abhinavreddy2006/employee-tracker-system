import express from "express";
import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

import {
    createEmployee,
    getEmployees,
    deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.route("/")
    .post(protect, adminOnly, createEmployee)
    .get(protect, adminOnly, getEmployees);

router.route("/:id")
    .delete(protect, adminOnly, deleteEmployee);

export default router;