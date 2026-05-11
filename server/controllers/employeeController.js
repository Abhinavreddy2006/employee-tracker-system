import Employee from "../models/employeeModel.js";


// CREATE EMPLOYEE
const createEmployee = async (req, res) => {

    try {

        const { name, email, position } = req.body;

        const employee = await Employee.create({
            name,
            email,
            position,
        });

        res.status(201).json(employee);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};


// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

        res.status(200).json(employees);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const deleteEmployee = async (req, res) => {

    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found",
            });

        }

        await employee.deleteOne();

        res.status(200).json({
            message: "Employee deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getEmployeeStats = async (req, res) => {

    try {

        const totalEmployees =
            await Employee.countDocuments();

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
    createEmployee,
    getEmployees,
    deleteEmployee,
    getEmployeeStats,
};