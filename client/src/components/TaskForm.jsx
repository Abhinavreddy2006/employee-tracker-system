import { useEffect, useState } from "react";
import axios from "axios";

function TaskForm({ fetchTasks }) {
    const [title,       setTitle]       = useState("");
    const [description, setDescription] = useState("");
    const [priority,    setPriority]    = useState("Medium");
    const [deadline,    setDeadline]    = useState("");
    const [assignedTo,  setAssignedTo]  = useState("");
    const [employees,   setEmployees]   = useState([]);
    const [success,     setSuccess]     = useState("");
    const [error,       setError]       = useState("");

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/employees", { headers });
            setEmployees(res.data);
        } catch (e) { console.log(e); }
    };

    useEffect(() => { fetchEmployees(); }, []);

    const createTask = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!assignedTo) { setError("Please select an employee to assign this task."); return; }
        if (!deadline)   { setError("Please set a deadline for this task."); return; }
        try {
            await axios.post(
                "http://localhost:5000/api/tasks",
                { title, description, priority, deadline, assignedTo },
                { headers }
            );
            setSuccess(`✅ Task "${title}" assigned successfully!`);
            setTitle(""); setDescription(""); setDeadline(""); setAssignedTo(""); setPriority("Medium");
            fetchTasks();
        } catch (e) {
            setError(e.response?.data?.message || "Failed to create task");
        }
    };

    // Priority explanations shown as helper text
    const priorityInfo = {
        Low:    "Low — no rush, complete when free",
        Medium: "Medium — standard timeline, complete on time",
        High:   "High — urgent, needs immediate attention",
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Create & Assign Task</h2>
            <p className="text-gray-400 text-sm mb-6">Fill in the details below and assign the task to an employee</p>

            {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 text-sm">{success}</p>}
            {error   && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 text-sm">{error}</p>}

            <form onSubmit={createTask} className="space-y-5">

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        placeholder="e.g. Fix login page bug"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                        placeholder="Describe what needs to be done..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Priority Level <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            <option value="Low">🟢 Low</option>
                            <option value="Medium">🟡 Medium</option>
                            <option value="High">🔴 High</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">{priorityInfo[priority]}</p>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Deadline (End Date) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">The date by which the task must be completed</p>
                    </div>
                </div>

                {/* Assign to employee */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Assign To <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={assignedTo}
                        onChange={e => setAssignedTo(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                        <option value="">— Select an employee —</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name}{emp.position ? ` (${emp.position})` : ""}
                            </option>
                        ))}
                    </select>
                    {employees.length === 0 && (
                        <p className="text-xs text-orange-400 mt-1">No employees found. Add employees first from the Employees page.</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition font-semibold"
                >
                    Assign Task
                </button>
            </form>
        </div>
    );
}

export default TaskForm;
