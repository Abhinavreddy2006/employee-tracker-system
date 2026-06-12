import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
    "/dashboard":     "Dashboard",
    "/employees":     "Employees",
    "/tasks":         "Tasks",
    "/attendance":    "Attendance",
    "/analytics":     "Analytics",
    "/notifications": "Notifications",
    "/profile":       "Profile",
};

function Navbar() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const location = useLocation();
    const pageTitle = PAGE_TITLES[location.pathname] || "WorkSphere";

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userInfo"); window.history.replaceState(null, "", "/"); window.location.replace("/");
    };

    return (
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <div>
                <h1 className="text-xl font-bold text-slate-800">{pageTitle}</h1>
                <p className="text-gray-400 text-xs mt-0.5">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-700">{userInfo?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{userInfo?.role}</p>
                </div>
                <div className="w-9 h-9 bg-blue-500 rounded-full text-white font-bold text-sm flex items-center justify-center">
                    {userInfo?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                    onClick={logoutHandler}
                    className="text-sm text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;
