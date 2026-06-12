import express from "express";
import { registerUser, loginUser, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",    loginUser);
router.put("/profile",   protect, updateProfile);   // edit name/email/position
router.put("/password",  protect, changePassword);  // change password

export default router;
