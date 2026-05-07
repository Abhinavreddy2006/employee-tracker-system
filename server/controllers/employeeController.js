import Employee from "../models/employeeModel.js";

const createEmployee = async (req, res) => {

    try {

        const employee = await Employee.create({
            name: "Rahul",
            email: "rahul@gmail.com",
            position: "Frontend Developer",
        });

        res.status(201).json(employee);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export { createEmployee };