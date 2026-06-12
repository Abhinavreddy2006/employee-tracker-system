import { useState } from "react";
import { loginUser } from "../services/authService";
import axios from "axios";

function LoginPage() {
    const [tab, setTab] = useState("login"); // "login" | "register"

    // Login state
    const [loginEmail,    setLoginEmail]    = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError,    setLoginError]    = useState("");
    const [loginLoading,  setLoginLoading]  = useState(false);

    // Register state
    const [regName,     setRegName]     = useState("");
    const [regEmail,    setRegEmail]    = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regPosition, setRegPosition] = useState("");
    const [regError,    setRegError]    = useState("");
    const [regSuccess,  setRegSuccess]  = useState("");
    const [regLoading,  setRegLoading]  = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);
        try {
            await loginUser({ email: loginEmail, password: loginPassword });
            window.location.href = "/dashboard";
        } catch (err) {
            setLoginError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError("");
        setRegSuccess("");
        if (regPassword.length < 6) {
            setRegError("Password must be at least 6 characters");
            return;
        }
        setRegLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/register", {
                name:     regName,
                email:    regEmail,
                password: regPassword,
                position: regPosition,
                role:     "employee",   // self-registered users are always employees
            });
            setRegSuccess("Account created! You can now log in.");
            setRegName(""); setRegEmail(""); setRegPassword(""); setRegPosition("");
            setTimeout(() => setTab("login"), 1500);
        } catch (err) {
            setRegError(err.response?.data?.message || "Registration failed");
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-slate-800">WorkSphere</h1>
                    <p className="text-gray-500 mt-1">Employee Tracker System</p>
                </div>

                {/* Tab switcher */}
                <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => { setTab("login"); setLoginError(""); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            tab === "login"
                                ? "bg-white text-slate-800 shadow"
                                : "text-gray-500 hover:text-slate-700"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setTab("register"); setRegError(""); setRegSuccess(""); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            tab === "register"
                                ? "bg-white text-slate-800 shadow"
                                : "text-gray-500 hover:text-slate-700"
                        }`}
                    >
                        Register
                    </button>
                </div>

                {/* LOGIN FORM */}
                {tab === "login" && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {loginError && (
                            <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{loginError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-60"
                        >
                            {loginLoading ? "Logging in..." : "Login"}
                        </button>
                        <p className="text-center text-sm text-gray-400 mt-2">
                            Don't have an account?{" "}
                            <button type="button" onClick={() => setTab("register")} className="text-blue-500 hover:underline">
                                Register here
                            </button>
                        </p>
                    </form>
                )}

                {/* REGISTER FORM */}
                {tab === "register" && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Position <span className="text-gray-400 font-normal">(e.g. Developer, Designer)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your job title"
                                value={regPosition}
                                onChange={e => setRegPosition(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {regError && (
                            <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{regError}</p>
                        )}
                        {regSuccess && (
                            <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm">✅ {regSuccess}</p>
                        )}
                        <button
                            type="submit"
                            disabled={regLoading}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-60"
                        >
                            {regLoading ? "Creating account..." : "Create Account"}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-1">
                            Self-registered accounts are set as Employee. Contact admin to become an admin.
                        </p>
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <button type="button" onClick={() => setTab("login")} className="text-blue-500 hover:underline">
                                Login here
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
