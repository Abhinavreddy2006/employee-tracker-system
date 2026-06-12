import { useEffect, useState } from "react";
import axios from "axios";

// Shows real notifications for whichever role is logged in.
// Used only on admin Dashboard; employees have their own NotificationsPage.
function NotificationPanel() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/notifications", { headers })
            .then(res => setNotifications(res.data.slice(0, 5)))
            .catch(console.log);
    }, []);

    const typeStyle = (msg = "") => {
        if (msg.toLowerCase().includes("deadline") || msg.toLowerCase().includes("overdue"))
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        if (msg.toLowerCase().includes("complet"))
            return "bg-green-100 text-green-800 border border-green-200";
        return "bg-blue-100 text-blue-800 border border-blue-200";
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Recent Notifications</h2>

            {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                    🔔 No notifications yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n, i) => (
                        <div key={n._id || i} className={`p-4 rounded-xl ${typeStyle(n.message)}`}>
                            <p className="font-medium">{n.message}</p>
                            <p className="text-xs opacity-60 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationPanel;
