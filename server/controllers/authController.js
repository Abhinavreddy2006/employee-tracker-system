import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, position } = req.body;
        if (await User.findOne({ email }))
            return res.status(400).json({ message: "User already exists" });

        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            role: role || "employee",
            position: position || "",
        });

        res.status(201).json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, position: user.position,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, position: user.position,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PROFILE (name, email, position)
const updateProfile = async (req, res) => {
    try {
        const { name, email, position } = req.body;

        // Check email not taken by another user
        const existing = await User.findOne({ email });
        if (existing && existing._id.toString() !== req.user._id.toString())
            return res.status(400).json({ message: "Email already in use by another account" });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, position },
            { new: true }
        ).select("-password");

        // Return full token so client can refresh localStorage
        res.status(200).json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, position: user.position,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CHANGE PASSWORD (requires current password verification)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, updateProfile, changePassword };
