import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        position: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;