import Attendance from "../models/attendanceModel.js";



// MARK ATTENDANCE
const markAttendance = async (req, res) => {

    try {

        const today = new Date()
            .toISOString()
            .split("T")[0];



        // CHECK IF ALREADY MARKED
        const alreadyMarked =
            await Attendance.findOne({
                employee: req.user._id,
                date: today,
            });



        if (alreadyMarked) {

            return res.status(400).json({
                message: "Attendance already marked today",
            });

        }



        // CREATE ATTENDANCE
        const attendance =
            await Attendance.create({
                employee: req.user._id,
                date: today,
            });



        res.status(201).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getMyAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find({
            employee: req.user._id,
        });

        res.status(200).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getAttendanceStats = async (req, res) => {

    try {

        const totalAttendance =
            await Attendance.countDocuments();

        res.status(200).json({
            totalAttendance,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export {
    markAttendance,
    getMyAttendance,
    getAttendanceStats,
};