import Attendance from "../models/attendanceModel.js";

const markAttendance = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const already = await Attendance.findOne({ employee: req.user._id, date: today });
        if (already) return res.status(400).json({ message: "Attendance already marked for today" });
        const att = await Attendance.create({ employee: req.user._id, date: today });
        res.status(201).json(att);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getMyAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// Admin: attendance for one specific employee (by ID)
const getEmployeeAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ employee: req.params.id }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate("employee", "name email position")
            .sort({ date: -1 });
        res.status(200).json(records);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getAttendanceStats = async (req, res) => {
    try {
        const totalAttendance = await Attendance.countDocuments();
        res.status(200).json({ totalAttendance });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

export { markAttendance, getMyAttendance, getEmployeeAttendance, getAllAttendance, getAttendanceStats };
