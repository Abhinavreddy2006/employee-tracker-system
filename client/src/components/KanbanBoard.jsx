// Simple task board — no drag and drop.
// Admin: read-only cards grouped by status.
// Employee: each card has a dropdown to change its status.

const PRIORITY_STYLE = {
    High:   { badge: "bg-red-100 text-red-700",    dot: "🔴" },
    Medium: { badge: "bg-yellow-100 text-yellow-700", dot: "🟡" },
    Low:    { badge: "bg-green-100 text-green-700",  dot: "🟢" },
};

const COLUMN_STYLE = {
    "Pending":     "border-t-4 border-slate-400 bg-slate-50",
    "In Progress": "border-t-4 border-blue-500  bg-blue-50",
    "Completed":   "border-t-4 border-green-500 bg-green-50",
};

const COLUMN_LABEL = {
    "Pending":     "⏳ Pending",
    "In Progress": "🔄 In Progress",
    "Completed":   "✅ Completed",
};

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

// Single task card
function TaskCard({ task, updateStatus }) {
    const p = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Low;
    const today    = new Date();
    const deadline = task.deadline ? new Date(task.deadline) : null;
    const isOverdue = deadline && deadline < today && task.status !== "Completed";

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">

            {/* Title + priority badge */}
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-slate-800 leading-snug">{task.title}</h3>
                <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${p.badge}`}>
                    {p.dot} {task.priority}
                </span>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-gray-500 text-sm leading-relaxed">{task.description}</p>
            )}

            {/* Assigned to (admin view shows who the task belongs to) */}
            {task.assignedTo?.name && (
                <p className="text-xs text-slate-500">
                    👤 <span className="font-medium">{task.assignedTo.name}</span>
                    {task.assignedTo.position ? ` — ${task.assignedTo.position}` : ""}
                </p>
            )}

            {/* Deadline */}
            {deadline && (
                <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-gray-400"}`}>
                    📅 Deadline: {deadline.toLocaleDateString()}
                    {isOverdue && <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Overdue</span>}
                </p>
            )}

            {/* Status changer — employees only */}
            {updateStatus && (
                <div className="pt-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Update Status</label>
                    <select
                        value={task.status}
                        onChange={e => updateStatus(task._id, e.target.value)}
                        className={`w-full text-sm p-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            task.status === "Completed"   ? "bg-green-50  border-green-300  text-green-700"  :
                            task.status === "In Progress" ? "bg-blue-50   border-blue-300   text-blue-700"   :
                                                           "bg-slate-50  border-slate-300  text-slate-700"
                        }`}
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

// Main board
function KanbanBoard({ tasks, updateStatus, readOnly = false }) {
    const columns = {
        "Pending":     tasks.filter(t => t.status === "Pending"),
        "In Progress": tasks.filter(t => t.status === "In Progress"),
        "Completed":   tasks.filter(t => t.status === "Completed"),
    };

    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(columns).map(([colName, colTasks]) => (
                    <div key={colName} className={`rounded-2xl p-5 min-h-80 ${COLUMN_STYLE[colName]}`}>

                        {/* Column header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">{COLUMN_LABEL[colName]}</h3>
                            <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                            {colTasks.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-8">No tasks</p>
                            ) : (
                                colTasks.map(task => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        updateStatus={readOnly ? null : updateStatus}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KanbanBoard;
