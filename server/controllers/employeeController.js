import User from "../models/userModel.js";



// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {

    try {

        const employees = await User.find({
            role: "employee",
        }).select("-password");



        res.status(200).json(employees);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Employee deleted",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// EMPLOYEE STATS
const getEmployeeStats = async (req, res) => {

    try {

        const totalEmployees =
            await User.countDocuments({
                role: "employee",
            });

        res.status(200).json({
            totalEmployees,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export {
    getEmployees,
    deleteEmployee,
    getEmployeeStats,
};