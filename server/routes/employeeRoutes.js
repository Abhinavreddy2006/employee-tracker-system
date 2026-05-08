import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    createEmployee,
    getEmployees,
    deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.route("/")
    .post(protect, createEmployee)
    .get(protect, getEmployees);

router.route("/:id")
    .delete(protect, deleteEmployee);

export default router;