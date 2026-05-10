import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        date: {
            type: String,
        },

        status: {
            type: String,
            default: "Present",
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model(
    "Attendance",
    attendanceSchema
);

export default Attendance;