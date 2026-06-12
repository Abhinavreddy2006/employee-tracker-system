import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage        from "./pages/LoginPage";
import DashboardPage    from "./pages/DashboardPage";
import EmployeesPage    from "./pages/EmployeesPage";
import TasksPage        from "./pages/TasksPage";
import AttendancePage   from "./pages/AttendancePage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage      from "./pages/ProfilePage";
import DashboardLayout  from "./components/DashboardLayout";

// ── Blocks browser back/forward to protected pages after logout ───────────────
function AuthGuard({ children }) {
    const navigate  = useNavigate();
    const location  = useLocation();

    useEffect(() => {
        const isPublic = location.pathname === "/";
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo && !isPublic) {
            // Replace current history entry so back button can't return here
            navigate("/", { replace: true });
        }

        // On every navigation push a new state so we can detect popstate
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            const info = JSON.parse(localStorage.getItem("userInfo"));
            if (!info) {
                // User is logged out — block navigation to any protected page
                window.history.pushState(null, "", "/");
                navigate("/", { replace: true });
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [location.pathname]);

    return children;
}

// ── Redirects to login if not logged in ──────────────────────────────────────
function ProtectedRoute({ children }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) return <Navigate to="/" replace />;
    return children;
}

// ── Admin-only route — redirects employees away ───────────────────────────────
function AdminRoute({ children }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo)                    return <Navigate to="/"          replace />;
    if (userInfo.role !== "admin")    return <Navigate to="/dashboard" replace />;
    return children;
}

// ── Login route — redirect already-logged-in users to dashboard ──────────────
function PublicRoute({ children }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) return <Navigate to="/dashboard" replace />;
    return children;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthGuard>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={
                        <PublicRoute><LoginPage /></PublicRoute>
                    } />

                    {/* Both roles */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout><DashboardPage /></DashboardLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                        <ProtectedRoute>
                            <DashboardLayout><TasksPage /></DashboardLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/attendance" element={
                        <ProtectedRoute>
                            <DashboardLayout><AttendancePage /></DashboardLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <DashboardLayout><AnalyticsPage /></DashboardLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <DashboardLayout><ProfilePage /></DashboardLayout>
                        </ProtectedRoute>
                    } />

                    {/* Employee only */}
                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <DashboardLayout><NotificationsPage /></DashboardLayout>
                        </ProtectedRoute>
                    } />

                    {/* Admin only */}
                    <Route path="/employees" element={
                        <AdminRoute>
                            <DashboardLayout><EmployeesPage /></DashboardLayout>
                        </AdminRoute>
                    } />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthGuard>
        </BrowserRouter>
    );
}

export default AppRoutes;
