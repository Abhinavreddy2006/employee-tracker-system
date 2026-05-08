import express from "express";

import {
    createEmployee,
    getEmployees,
    deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.route("/")
    .post(createEmployee)
    .get(getEmployees);

router.route("/:id")
    .delete(deleteEmployee);

export default router;