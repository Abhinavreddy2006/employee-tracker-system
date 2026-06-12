import Task from "../models/taskModel.js";
import Notification from "../models/notificationModel.js";
import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";



// CREATE TASK
const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            assignedTo,
            priority,
            deadline,
        } = req.body;



        const task = await Task.create({
            title,
            description,
            assignedTo,
            priority,
            deadline,
        });



        // CREATE NOTIFICATION
        await Notification.create({
            user: assignedTo,
            message: `New task assigned: ${title}`,
        });



        // CREATE ACTIVITY
        await Activity.create({
            message: `New task assigned: ${title}`,
        });



        res.status(201).json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// GET MY TASKS
const getMyTasks = async (req, res) => {

    try {

        const tasks = await Task.find({
            assignedTo: req.user._id,
        }).populate("assignedTo", "name email");



        res.status(200).json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);



        if (!task) {

            return res.status(404).json({
                message: "Task not found",
            });

        }



        task.status = req.body.status;

        const updatedTask = await task.save();



        // ACTIVITY LOG
        await Activity.create({
            message: `${req.user.name} updated task status to ${req.body.status}`,
        });



        res.status(200).json(updatedTask);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// PRODUCTIVITY SCORE
const getProductivityScore = async (req, res) => {

    try {

        const completedTasks =
            await Task.countDocuments({
                assignedTo: req.user._id,
                status: "Completed",
            });



        const totalTasks =
            await Task.countDocuments({
                assignedTo: req.user._id,
            });



        const productivity =
            totalTasks === 0
                ? 0
                : Math.round(
                    (completedTasks / totalTasks) * 100
                );



        res.status(200).json({
            productivity,
            completedTasks,
            totalTasks,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// TASK STATS
const getTaskStats = async (req, res) => {

    try {

        const totalTasks =
            await Task.countDocuments();

        const completedTasks =
            await Task.countDocuments({
                status: "Completed",
            });

        const pendingTasks =
            await Task.countDocuments({
                status: "Pending",
            });

        const inProgressTasks =
            await Task.countDocuments({
                status: "In Progress",
            });



        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// LEADERBOARD
const getLeaderboard = async (req, res) => {

    try {

        const employees = await User.find({
            role: "employee",
        });



        const leaderboard = await Promise.all(

            employees.map(async (employee) => {

                const completedTasks =
                    await Task.countDocuments({
                        assignedTo: employee._id,
                        status: "Completed",
                    });



                const totalTasks =
                    await Task.countDocuments({
                        assignedTo: employee._id,
                    });



                const score =
                    totalTasks === 0
                        ? 0
                        : Math.round(
                            (completedTasks / totalTasks) * 100
                        );



                return {
                    name: employee.name,
                    score,
                };
            })
        );



        leaderboard.sort(
            (a, b) => b.score - a.score
        );



        res.status(200).json(leaderboard);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// GET ALL TASKS
const getAllTasks = async (req, res) => {

    try {

        const tasks = await Task.find()
            .populate("assignedTo", "name email");



        res.status(200).json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};



// OVERDUE TASKS
const getOverdueTasks = async (req, res) => {

    try {

        const today = new Date();



        const overdueTasks = await Task.find({

            deadline: {
                $lt: today,
            },

            status: {
                $ne: "Completed",
            },
        }).populate("assignedTo", "name position");



        res.status(200).json(overdueTasks);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export {
    createTask,
    getMyTasks,
    updateTaskStatus,
    getProductivityScore,
    getTaskStats,
    getLeaderboard,
    getAllTasks,
    getOverdueTasks,
};