import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import AnalyticsChart from "../components/AnalyticsChart";
import EmployeeTable from "../components/EmployeeTable";
import Leaderboard from "../components/Leaderboard";
import ActivityFeed from "../components/ActivityFeed";
import KanbanBoard from "../components/KanbanBoard";

function DashboardPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin  = userInfo?.role === "admin";
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    // Admin
    const [stats,           setStats]           = useState({});
    const [employeeStats,   setEmployeeStats]   = useState({});

    const [employees,       setEmployees]       = useState([]);
    const [allTasks,        setAllTasks]        = useState([]);
    const [search,          setSearch]          = useState("");

    // Employee
    const [myTasks,      setMyTasks]      = useState([]);
    const [productivity, setProductivity] = useState({});
    const [attMsg,       setAttMsg]       = useState("");
    const [attErr,       setAttErr]       = useState("");

    const fetchAdminData = async () => {
        try {
            const [s, es, e, t] = await Promise.all([
                axios.get("http://localhost:5000/api/tasks/stats",      { headers }),
                axios.get("http://localhost:5000/api/employees/stats",  { headers }),
                axios.get("http://localhost:5000/api/employees",        { headers }),
                axios.get("http://localhost:5000/api/tasks",            { headers }),
            ]);
            setStats(s.data);
            setEmployeeStats(es.data);
            setEmployees(e.data);
            setAllTasks(t.data);
        } catch (e) { console.log(e); }
    };

    const fetchEmployeeData = async () => {
        try {
            const [p, t] = await Promise.all([
                axios.get("http://localhost:5000/api/tasks/productivity", { headers }),
                axios.get("http://localhost:5000/api/tasks/mytasks",      { headers }),
            ]);
            setProductivity(p.data);
            setMyTasks(t.data);
        } catch (e) { console.log(e); }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status }, { headers });
            fetchEmployeeData();
        } catch (e) { console.log(e); }
    };

    const markAttendance = async () => {
        setAttMsg(""); setAttErr("");
        try {
            await axios.post("http://localhost:5000/api/attendance/mark", {}, { headers });
            setAttMsg("✅ Attendance marked for today!");
        } catch (e) {
            setAttErr(e.response?.data?.message || "Error marking attendance");
        }
    };

    useEffect(() => {
        isAdmin ? fetchAdminData() : fetchEmployeeData();
    }, []);

    const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase())
    );

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    if (isAdmin) {
        const rate = stats.totalTasks
            ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome back, {userInfo?.name} 👋
                    </h1>
                    <p className="text-gray-400 mt-1">Here's your team overview for today</p>
                </div>

                {/* Stat cards */}
                <div className="flex flex-wrap gap-4">
                    <DashboardCard title="Total Tasks"    value={stats.totalTasks        ?? 0} color="slate"  />
                    <DashboardCard title="Completed"      value={stats.completedTasks    ?? 0} color="green"  />
                    <DashboardCard title="In Progress"    value={stats.inProgressTasks   ?? 0} color="blue"   />
                    <DashboardCard title="Pending"        value={stats.pendingTasks      ?? 0} color="yellow" />
                    <DashboardCard title="Employees"      value={employeeStats.totalEmployees  ?? 0} color="purple" />
                    
                </div>

                <AnalyticsChart stats={stats} />
                <Leaderboard />
                <ActivityFeed />

                {allTasks.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <KanbanBoard tasks={allTasks} readOnly={true} />
                    </div>
                )}

                <div>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full p-4 rounded-xl border border-slate-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <EmployeeTable employees={filtered} />
                </div>
            </div>
        );
    }

    // ── EMPLOYEE ──────────────────────────────────────────────────────────────
    const pending    = myTasks.filter(t => t.status === "Pending").length;
    const inProgress = myTasks.filter(t => t.status === "In Progress").length;
    const completed  = myTasks.filter(t => t.status === "Completed").length;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome, {userInfo?.name} 👋
                    </h1>
                    <p className="text-gray-400 mt-1">Track your tasks and daily progress</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={markAttendance}
                        className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition font-medium shadow-sm"
                    >
                        ✅ Mark Attendance
                    </button>
                    {attMsg && <p className="text-green-600 text-sm">{attMsg}</p>}
                    {attErr && <p className="text-red-500 text-sm">{attErr}</p>}
                </div>
            </div>

            {/* Productivity + mini stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-1 bg-white p-6 rounded-2xl shadow-sm text-center border-2 border-blue-100">
                    <p className="text-gray-400 text-sm mb-1">Productivity</p>
                    <h2 className="text-5xl font-bold text-blue-600">{productivity.productivity ?? 0}%</h2>
                    <p className="text-gray-400 text-xs mt-2">
                        {productivity.completedTasks ?? 0} / {productivity.totalTasks ?? 0} tasks done
                    </p>
                </div>
                <DashboardCard title="Pending"     value={pending}    color="yellow" />
                <DashboardCard title="In Progress" value={inProgress} color="blue"   />
                <DashboardCard title="Completed"   value={completed}  color="green"  />
            </div>

            {myTasks.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-gray-500 text-lg font-medium">No tasks assigned yet</p>
                    <p className="text-gray-400 text-sm mt-1">Your admin will assign tasks to you soon.</p>
                </div>
            ) : (
                <KanbanBoard tasks={myTasks} updateStatus={updateTaskStatus} readOnly={false} />
            )}
        </div>
    );
}

export default DashboardPage;
