import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
    const location = useLocation();
    const userInfo  = JSON.parse(localStorage.getItem("userInfo"));
    const role      = userInfo?.role;
    const headers   = { Authorization: `Bearer ${userInfo?.token}` };

    const [unreadCount, setUnreadCount] = useState(0);

    // Poll unread notification count every 30 seconds (employees only)
    useEffect(() => {
        if (role !== "employee") return;
        const fetchUnread = () => {
            axios.get("http://localhost:5000/api/notifications", { headers })
                .then(res => setUnreadCount(res.data.filter(n => !n.read).length))
                .catch(() => {});
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    const allMenuItems = [
        { name: "Dashboard",      path: "/dashboard",     icon: "🏠", roles: ["admin", "employee"] },
        { name: "Employees",      path: "/employees",     icon: "👥", roles: ["admin"] },
        { name: "Tasks",          path: "/tasks",         icon: "📋", roles: ["admin", "employee"] },
        { name: "Attendance",     path: "/attendance",    icon: "📅", roles: ["admin", "employee"] },
        { name: "Analytics",      path: "/analytics",     icon: "📊", roles: ["admin", "employee"] },
        { name: "Notifications",  path: "/notifications", icon: "🔔", roles: ["employee"], badge: unreadCount },
        { name: "Profile",        path: "/profile",       icon: "👤", roles: ["admin", "employee"] },
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(role));

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userInfo"); window.history.replaceState(null, "", "/"); window.location.replace("/");
    };

    return (
        <div className="w-64 min-h-screen bg-slate-900 text-white p-6 flex-shrink-0 flex flex-col">
            {/* Brand */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-white">WorkSphere</h2>
                <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                    role === "admin" ? "bg-purple-600" : "bg-blue-600"
                }`}>
                    {role === "admin" ? "Admin Panel" : "Employee Panel"}
                </span>
            </div>

            {/* Nav */}
            <nav className="space-y-1 flex-1">
                {menuItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}>
                                <span className="flex items-center gap-3">
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </span>
                                {/* Unread badge */}
                                {item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? "9+" : item.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User info + logout */}
            <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{userInfo?.name}</p>
                        <p className="text-slate-400 text-xs truncate">{userInfo?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left text-slate-400 hover:text-red-400 text-sm px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
