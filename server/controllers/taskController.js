import Task from "../models/taskModel.js";

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

export {
    createTask,
    getMyTasks,
    updateTaskStatus,
    getTaskStats,
};
