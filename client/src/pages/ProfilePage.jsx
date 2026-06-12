import { useState } from "react";
import axios from "axios";

function ProfilePage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    // ── Edit profile state ────────────────────────────────────────────────────
    const [editMode,   setEditMode]   = useState(false);
    const [name,       setName]       = useState(userInfo?.name     || "");
    const [email,      setEmail]      = useState(userInfo?.email    || "");
    const [position,   setPosition]   = useState(userInfo?.position || "");
    const [editMsg,    setEditMsg]    = useState("");
    const [editErr,    setEditErr]    = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // ── Change password state ─────────────────────────────────────────────────
    const [currentPw,  setCurrentPw]  = useState("");
    const [newPw,      setNewPw]      = useState("");
    const [confirmPw,  setConfirmPw]  = useState("");
    const [pwMsg,      setPwMsg]      = useState("");
    const [pwErr,      setPwErr]      = useState("");
    const [pwLoading,  setPwLoading]  = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ── Save profile edits ────────────────────────────────────────────────────
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setEditErr(""); setEditMsg("");
        if (!name.trim())  { setEditErr("Name cannot be empty"); return; }
        if (!email.trim()) { setEditErr("Email cannot be empty"); return; }

        setEditLoading(true);
        try {
            const res = await axios.put(
                "http://localhost:5000/api/auth/profile",
                { name: name.trim(), email: email.trim(), position: position.trim() },
                { headers }
            );
            // Update localStorage so all pages reflect the new name/email
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setEditMsg("✅ Profile updated successfully!");
            setEditMode(false);
        } catch (err) {
            setEditErr(err.response?.data?.message || "Failed to update profile");
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset fields to saved values
        const u = JSON.parse(localStorage.getItem("userInfo"));
        setName(u?.name || ""); setEmail(u?.email || ""); setPosition(u?.position || "");
        setEditErr(""); setEditMsg("");
        setEditMode(false);
    };

    // ── Change password ───────────────────────────────────────────────────────
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwErr(""); setPwMsg("");

        if (!currentPw) { setPwErr("Please enter your current password"); return; }
        if (newPw.length < 6) { setPwErr("New password must be at least 6 characters"); return; }
        if (newPw !== confirmPw) { setPwErr("New passwords do not match"); return; }
        if (newPw === currentPw) { setPwErr("New password must be different from current password"); return; }

        setPwLoading(true);
        try {
            await axios.put(
                "http://localhost:5000/api/auth/password",
                { currentPassword: currentPw, newPassword: newPw },
                { headers }
            );
            setPwMsg("✅ Password changed successfully!");
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
        } catch (err) {
            setPwErr(err.response?.data?.message || "Failed to change password");
        } finally {
            setPwLoading(false);
        }
    };

    // Read fresh from localStorage in case we just updated
    const current = JSON.parse(localStorage.getItem("userInfo"));

    const PasswordInput = ({ label, value, setValue, show, setShow, placeholder }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                    {show ? "Hide" : "Show"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                <p className="text-gray-400 mt-1">Manage your account details and security</p>
            </div>

            {/* ── Profile card ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Avatar banner */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex items-center gap-5">
                    <div className="w-16 h-16 bg-white text-blue-600 flex items-center justify-center rounded-full text-2xl font-bold flex-shrink-0">
                        {current?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{current?.name}</h2>
                        <p className="text-blue-100 text-sm">{current?.email}</p>
                        <span className="mt-1 inline-block bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full capitalize">
                            {current?.role}
                        </span>
                    </div>
                </div>

                {/* Details / edit form */}
                <div className="p-8">
                    {editMsg && !editMode && (
                        <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-5">{editMsg}</p>
                    )}

                    {!editMode ? (
                        /* ── View mode ── */
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name",    value: current?.name },
                                    { label: "Email",        value: current?.email },
                                    { label: "Position",     value: current?.position || "—" },
                                    { label: "Role",         value: current?.role, cap: true },
                                ].map(({ label, value, cap }) => (
                                    <div key={label} className="bg-slate-50 px-5 py-4 rounded-xl">
                                        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
                                        <p className={`font-semibold text-slate-800 ${cap ? "capitalize" : ""}`}>{value}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { setEditMode(true); setEditMsg(""); }}
                                className="mt-2 bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition text-sm font-semibold"
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    ) : (
                        /* ── Edit mode ── */
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-400">*</span></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Position <span className="text-gray-400 font-normal">(job title)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={e => setPosition(e.target.value)}
                                        placeholder="e.g. Frontend Developer"
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {editErr && <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{editErr}</p>}

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition text-sm font-semibold disabled:opacity-60"
                                >
                                    {editLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl hover:bg-slate-200 transition text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ── Change password ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Change Password</h2>
                <p className="text-gray-400 text-sm mb-6">You must confirm your current password before setting a new one</p>

                {pwMsg && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4">{pwMsg}</p>}
                {pwErr && <p className="text-red-500   bg-red-50   p-3 rounded-lg text-sm mb-4">{pwErr}</p>}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <PasswordInput
                        label="Current Password"
                        value={currentPw}
                        setValue={setCurrentPw}
                        show={showCurrent}
                        setShow={setShowCurrent}
                        placeholder="Enter your current password"
                    />

                    <div className="border-t border-slate-100 pt-4 space-y-4">
                        <PasswordInput
                            label="New Password"
                            value={newPw}
                            setValue={setNewPw}
                            show={showNew}
                            setShow={setShowNew}
                            placeholder="Min 6 characters"
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPw}
                            setValue={setConfirmPw}
                            show={showConfirm}
                            setShow={setShowConfirm}
                            placeholder="Repeat new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pwLoading}
                        className="bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition text-sm font-semibold disabled:opacity-60"
                    >
                        {pwLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
