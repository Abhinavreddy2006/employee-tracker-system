import { useEffect, useState } from "react";
import axios from "axios";

function NotificationsPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/notifications", { headers });
            setNotifications(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // Update state instantly — no page refresh needed
    const markOneAsRead = async (id) => {
        // Optimistic update: change UI immediately
        setNotifications(prev =>
            prev.map(n => n._id === id ? { ...n, read: true } : n)
        );
        try {
            await axios.patch(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                { headers }
            );
        } catch (e) {
            // Revert on failure
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: false } : n)
            );
            console.log(e);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update: mark all read instantly
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await axios.patch(
                "http://localhost:5000/api/notifications/markallread",
                {},
                { headers }
            );
        } catch (e) {
            // Revert on failure
            fetchNotifications();
            console.log(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold text-slate-800">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                            : "✅ All caught up — no unread notifications"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-700 border border-blue-300 hover:border-blue-500 px-4 py-2 rounded-xl transition font-medium"
                    >
                        ✓ Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications list */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-3">🔔</p>
                        <p className="text-gray-500 text-lg font-medium">No notifications yet</p>
                        <p className="text-gray-400 text-sm mt-1">
                            You'll receive a notification whenever a task is assigned to you.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                                    !n.read
                                        ? "bg-blue-50 hover:bg-blue-100"
                                        : "bg-white hover:bg-slate-50"
                                }`}
                            >
                                {/* Unread / read dot */}
                                <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                                    !n.read ? "bg-blue-500" : "bg-slate-200"
                                }`} />

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-relaxed ${
                                        !n.read
                                            ? "font-semibold text-slate-800"
                                            : "font-normal text-slate-500"
                                    }`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(n.createdAt).toLocaleString("en-IN", {
                                            day: "numeric", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                {/* Mark as read */}
                                {!n.read && (
                                    <button
                                        onClick={() => markOneAsRead(n._id)}
                                        className="flex-shrink-0 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition font-medium"
                                    >
                                        Mark read
                                    </button>
                                )}

                                {/* Read checkmark */}
                                {n.read && (
                                    <span className="flex-shrink-0 text-xs text-slate-300 mt-0.5">✓ Read</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer count */}
            {notifications.length > 0 && (
                <p className="text-xs text-gray-400 text-right pr-1">
                    {notifications.filter(n => n.read).length} of {notifications.length} read
                </p>
            )}
        </div>
    );
}

export default NotificationsPage;
