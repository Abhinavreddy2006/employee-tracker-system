import { useEffect, useState } from "react";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";

function TasksPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = userInfo?.role === "admin";
    const headers = { Authorization: `Bearer ${userInfo?.token}` };

    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            // Admin fetches ALL tasks; employee fetches only their own
            const endpoint = isAdmin
                ? "http://localhost:5000/api/tasks"
                : "http://localhost:5000/api/tasks/mytasks";

            const res = await axios.get(endpoint, { headers });
            setTasks(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    // Only employees can update status — admin board is read-only
    const updateStatus = async (id, status) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/tasks/${id}`,
                { status },
                { headers }
            );
            fetchTasks();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ── ADMIN VIEW ────────────────────────────────────────────────────────────
    if (isAdmin) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Task Management</h1>
                    <p className="text-gray-500 mt-2">Create tasks and assign them to employees</p>
                </div>

                {/* Task creation form — admin only */}
                <TaskForm fetchTasks={fetchTasks} />

                {/* Read-only Kanban — admin cannot drag/change status */}
                {tasks.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-400 text-xl">📋 No tasks yet</p>
                        <p className="text-gray-400 mt-2">Use the form above to create and assign tasks to employees.</p>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <KanbanBoard tasks={tasks} readOnly={true} />
                    </div>
                )}
            </div>
        );
    }

    // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-800">My Tasks</h1>
                <p className="text-gray-500 mt-2">
                    Update the status of each task using the dropdown on the card
                </p>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xl">📭 No tasks assigned yet</p>
                    <p className="text-gray-400 mt-2">Your admin will assign tasks to you soon.</p>
                </div>
            ) : (
                <KanbanBoard
                    tasks={tasks}
                    updateStatus={updateStatus}
                    readOnly={false}
                />
            )}
        </div>
    );
}

export default TasksPage;
