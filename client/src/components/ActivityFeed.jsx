import { useEffect, useState } from "react";
import axios from "axios";

function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    useEffect(() => {
        axios.get("http://localhost:5000/api/tasks", { headers })
            .then(res => {
                const items = res.data
                    .map(task => ({
                        text: buildLine(task),
                        date: task.updatedAt || task.createdAt,
                        status: task.status,
                    }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 8);
                setActivities(items);
            })
            .catch(console.log);
    }, []);

    function buildLine(task) {
        const who = task.assignedTo?.name ?? "Someone";
        if (task.status === "Completed")   return `✅ ${who} completed "${task.title}"`;
        if (task.status === "In Progress") return `🔄 ${who} is working on "${task.title}"`;
        return `📋 "${task.title}" assigned to ${who}`;
    }

    const dot = (status) =>
        status === "Completed"   ? "bg-green-500" :
        status === "In Progress" ? "bg-blue-500"  : "bg-slate-300";

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Team Activity</h2>
            <p className="text-gray-400 text-sm mb-6">Latest task updates across your team</p>

            {activities.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No activity yet.</p>
            ) : (
                <div className="space-y-1">
                    {activities.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dot(item.status)}`} />
                            <div className="flex-1">
                                <p className="text-sm text-slate-700">{item.text}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(item.date).toLocaleString("en-IN", {
                                        day: "numeric", month: "short",
                                        hour: "2-digit", minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default ActivityFeed;
