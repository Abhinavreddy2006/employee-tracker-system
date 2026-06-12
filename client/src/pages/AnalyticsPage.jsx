import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsChart from "../components/AnalyticsChart";
import Leaderboard from "../components/Leaderboard";

function AnalyticsPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = userInfo?.role === "admin";
    const headers = { Authorization: `Bearer ${userInfo?.token}` };

    // Admin state
    const [stats, setStats] = useState({});
    const [overdueTasks, setOverdueTasks] = useState([]);

    // Employee state
    const [productivity, setProductivity] = useState({});
    const [myTasks, setMyTasks] = useState([]);

    useEffect(() => {
        if (isAdmin) {
            // Admin-only API calls
            axios.get("http://localhost:5000/api/tasks/stats", { headers })
                .then(r => setStats(r.data)).catch(console.log);
            axios.get("http://localhost:5000/api/tasks/overdue", { headers })
                .then(r => setOverdueTasks(r.data)).catch(console.log);
        } else {
            // Employee-only API calls
            axios.get("http://localhost:5000/api/tasks/productivity", { headers })
                .then(r => setProductivity(r.data)).catch(console.log);
            axios.get("http://localhost:5000/api/tasks/mytasks", { headers })
                .then(r => setMyTasks(r.data)).catch(console.log);
        }
    }, []);

    // ── ADMIN VIEW ────────────────────────────────────────────────────────────
    if (isAdmin) {
        const completionRate = stats.totalTasks
            ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
            : 0;

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Analytics</h1>
                    <p className="text-gray-500 mt-2">Team-wide performance and task statistics</p>
                </div>

                {/* Summary stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Completion Rate</p>
                        <h2 className="text-4xl font-bold text-blue-600 mt-2">{completionRate}%</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Total Tasks</p>
                        <h2 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalTasks ?? 0}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Completed</p>
                        <h2 className="text-4xl font-bold text-green-600 mt-2">{stats.completedTasks ?? 0}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Overdue</p>
                        <h2 className="text-4xl font-bold text-red-500 mt-2">{overdueTasks.length}</h2>
                    </div>
                </div>

                {/* Bar chart — all tasks */}
                <AnalyticsChart stats={stats} />

                {/* Leaderboard — admin only */}
                <Leaderboard />

                {/* Overdue tasks list */}
                {overdueTasks.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-red-600">⚠️ Overdue Tasks</h2>
                        <div className="space-y-3">
                            {overdueTasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-xl">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{task.title}</h3>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            👤 {task.assignedTo?.name ?? "Unknown Employee"}
                                            {task.assignedTo?.position && <span className="text-gray-400"> · {task.assignedTo.position}</span>}
                                            <span className="mx-2 text-gray-300">·</span>
                                            📅 Deadline: {new Date(task.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                        task.priority === "High"   ? "bg-red-100 text-red-700" :
                                        task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                                     "bg-green-100 text-green-700"
                                    }`}>{task.priority}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
    const myCompleted  = myTasks.filter(t => t.status === "Completed").length;
    const myInProgress = myTasks.filter(t => t.status === "In Progress").length;
    const myPending    = myTasks.filter(t => t.status === "Pending").length;
    const myOverdue    = myTasks.filter(t => {
        return new Date(t.deadline) < new Date() && t.status !== "Completed";
    });

    const myStats = {
        completedTasks:  myCompleted,
        pendingTasks:    myPending,
        inProgressTasks: myInProgress,
        totalTasks:      myTasks.length,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-800">My Analytics</h1>
                <p className="text-gray-500 mt-2">Your personal performance and task breakdown</p>
            </div>

            {/* Productivity score hero */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex items-center gap-8">
                <div className="text-center">
                    <p className="text-gray-500 text-sm mb-1">Productivity Score</p>
                    <h2 className="text-7xl font-bold text-blue-600">
                        {productivity.productivity ?? 0}%
                    </h2>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                        <p className="text-gray-500 text-xs">Completed</p>
                        <h3 className="text-3xl font-bold text-green-600 mt-1">{myCompleted}</h3>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-gray-500 text-xs">In Progress</p>
                        <h3 className="text-3xl font-bold text-blue-600 mt-1">{myInProgress}</h3>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <p className="text-gray-500 text-xs">Pending</p>
                        <h3 className="text-3xl font-bold text-slate-600 mt-1">{myPending}</h3>
                    </div>
                </div>
            </div>

            {/* Bar chart of own tasks */}
            <AnalyticsChart stats={myStats} />

            {/* My overdue tasks */}
            {myOverdue.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-red-600">⚠️ My Overdue Tasks</h2>
                    <div className="space-y-3">
                        {myOverdue.map(task => (
                            <div key={task._id} className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-xl">
                                <div>
                                    <h3 className="font-bold text-slate-800">{task.title}</h3>
                                    <p className="text-gray-500 text-sm mt-0.5">
                                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    task.priority === "High"   ? "bg-red-100 text-red-700" :
                                    task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                                 "bg-green-100 text-green-700"
                                }`}>{task.priority}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalyticsPage;
