import { useEffect, useState } from "react";
import axios from "axios";

// ── Group date strings by "YYYY-MM" key ──────────────────────────────────────
function groupByMonth(records) {
    const groups = {};
    records.forEach(r => {
        const key = r.date.slice(0, 7); // "2026-06"
        if (!groups[key]) groups[key] = [];
        groups[key].push(r.date);
    });
    return groups;
}

// Format "2026-06" → "June 2026"
function formatMonthKey(key) {
    const [y, m] = key.split("-");
    return new Date(Number(y), Number(m) - 1, 1)
        .toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Single month calendar ────────────────────────────────────────────────────
function MonthCalendar({ monthKey, dates }) {
    const presentSet = new Set(dates);
    const [y, m]     = monthKey.split("-").map(Number);
    const daysInMonth  = new Date(y, m, 0).getDate();
    const firstWeekday = new Date(y, m - 1, 1).getDay();

    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        cells.push({ day: d, dateStr, present: presentSet.has(dateStr) });
    }
    // fill last row
    const remainder = cells.length % 7;
    if (remainder !== 0) {
        for (let i = 0; i < 7 - remainder; i++) cells.push(null);
    }

    const presentCount = dates.length;
    const rate = Math.round((presentCount / daysInMonth) * 100);

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">{formatMonthKey(monthKey)}</h3>
                <div className="text-right">
                    <p className="text-white font-bold">{presentCount} / {daysInMonth} days</p>
                    <p className="text-slate-300 text-xs">{rate}% attendance</p>
                </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 p-px">
                {cells.map((cell, i) => {
                    if (!cell) return <div key={`e${i}`} className="bg-white h-10" />;
                    return (
                        <div
                            key={cell.dateStr}
                            title={cell.present ? `${cell.dateStr} — Present` : `${cell.dateStr} — Absent`}
                            className={`h-10 flex items-center justify-center text-sm font-medium rounded-sm transition ${
                                cell.present
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-slate-300"
                            }`}
                        >
                            {cell.day}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="px-6 py-3 flex gap-4 text-xs text-gray-500 border-t border-slate-50">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Present
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block" /> Absent
                </span>
            </div>
        </div>
    );
}

// ── Month/Year picker component ──────────────────────────────────────────────
function MonthPicker({ allMonthKeys, selectedMonth, onChange }) {
    // Build list of all months from earliest record to today
    const today     = new Date();
    const thisKey   = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // Merge months from records + current month always shown
    const keySet = new Set([...allMonthKeys, thisKey]);
    // Sort descending (newest first)
    const sorted = Array.from(keySet).sort((a, b) => b.localeCompare(a));

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-3">Select Month</p>
            <div className="flex flex-wrap gap-2">
                {sorted.map(key => (
                    <button
                        key={key}
                        onClick={() => onChange(key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                            selectedMonth === key
                                ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                    >
                        {formatMonthKey(key)}
                        {key === thisKey && <span className="ml-1 text-xs opacity-70">(current)</span>}
                    </button>
                ))}
                {sorted.length === 0 && (
                    <p className="text-gray-400 text-sm">No records yet</p>
                )}
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
function AttendancePage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin  = userInfo?.role === "admin";
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    const today    = new Date();
    const thisKey  = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // Admin state
    const [employees,        setEmployees]        = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [empAttendance,    setEmpAttendance]    = useState([]);
    const [loadingEmp,       setLoadingEmp]       = useState(false);
    const [selectedMonth,    setSelectedMonth]    = useState(thisKey);

    // Employee state
    const [myAttendance,  setMyAttendance]  = useState([]);
    const [myMonth,       setMyMonth]       = useState(thisKey);
    const [message,       setMessage]       = useState("");
    const [error,         setError]         = useState("");

    // ── Admin: load employees ─────────────────────────────────────────────────
    useEffect(() => {
        if (!isAdmin) return;
        axios.get("http://localhost:5000/api/employees", { headers })
            .then(r => {
                setEmployees(r.data);
                if (r.data.length > 0) setSelectedEmployee(r.data[0]._id);
            })
            .catch(console.log);
    }, []);

    // ── Admin: load attendance when employee changes ───────────────────────────
    useEffect(() => {
        if (!isAdmin || !selectedEmployee) return;
        setLoadingEmp(true);
        setSelectedMonth(thisKey); // reset to current month on employee change
        axios.get(`http://localhost:5000/api/attendance/employee/${selectedEmployee}`, { headers })
            .then(r => setEmpAttendance(r.data))
            .catch(console.log)
            .finally(() => setLoadingEmp(false));
    }, [selectedEmployee]);

    // ── Employee: load own attendance ─────────────────────────────────────────
    useEffect(() => {
        if (isAdmin) return;
        axios.get("http://localhost:5000/api/attendance/myattendance", { headers })
            .then(r => setMyAttendance(r.data))
            .catch(console.log);
    }, []);

    const markAttendance = async () => {
        setError(""); setMessage("");
        try {
            await axios.post("http://localhost:5000/api/attendance/mark", {}, { headers });
            setMessage("✅ Attendance marked for today!");
            const r = await axios.get("http://localhost:5000/api/attendance/myattendance", { headers });
            setMyAttendance(r.data);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to mark attendance");
        }
    };

    // ── ADMIN VIEW ────────────────────────────────────────────────────────────
    if (isAdmin) {
        const selectedEmpObj = employees.find(e => e._id === selectedEmployee);
        const allMonthGroups = groupByMonth(empAttendance);
        const allMonthKeys   = Object.keys(allMonthGroups);
        // Show only the selected month's calendar
        const visibleDates   = allMonthGroups[selectedMonth] || [];
        const totalPresent   = empAttendance.length;

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Attendance Records</h1>
                    <p className="text-gray-400 mt-1">Select an employee, then choose a month to view</p>
                </div>

                {/* Employee selector */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Select Employee</p>
                    <div className="flex flex-wrap gap-3">
                        {employees.map(emp => (
                            <button
                                key={emp._id}
                                onClick={() => setSelectedEmployee(emp._id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition font-medium text-sm ${
                                    selectedEmployee === emp._id
                                        ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                                }`}
                            >
                                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                                    selectedEmployee === emp._id ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600"
                                }`}>
                                    {emp.name.charAt(0).toUpperCase()}
                                </span>
                                {emp.name}
                                {emp.position && <span className="opacity-60 text-xs">· {emp.position}</span>}
                            </button>
                        ))}
                        {employees.length === 0 && (
                            <p className="text-gray-400 text-sm">No employees found.</p>
                        )}
                    </div>
                </div>

                {/* Employee summary bar */}
                {selectedEmpObj && (
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50 border border-blue-100 px-6 py-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {selectedEmpObj.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{selectedEmpObj.name}</p>
                                <p className="text-sm text-gray-500">{selectedEmpObj.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{totalPresent} days total</p>
                            <p className="text-xs text-gray-400">across all months</p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loadingEmp ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400">Loading attendance...</p>
                    </div>
                ) : selectedEmployee && (
                    <>
                        {/* Month picker */}
                        <MonthPicker
                            allMonthKeys={allMonthKeys}
                            selectedMonth={selectedMonth}
                            onChange={setSelectedMonth}
                        />

                        {/* Calendar for selected month */}
                        <MonthCalendar
                            monthKey={selectedMonth}
                            dates={visibleDates}
                        />

                        {/* No records note */}
                        {visibleDates.length === 0 && (
                            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                                <p className="text-gray-400">No attendance records for {formatMonthKey(selectedMonth)}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
    const myMonthGroups = groupByMonth(myAttendance);
    const myMonthKeys   = Object.keys(myMonthGroups);
    const myVisibleDates = myMonthGroups[myMonth] || [];
    const myTotal        = myAttendance.length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Attendance</h1>
                <p className="text-gray-400 mt-1">Mark your attendance and browse by month</p>
            </div>

            {/* Mark today */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Today</h2>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {today.toLocaleDateString("en-IN", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric"
                        })}
                    </p>
                    {message && <p className="text-green-600 text-sm mt-2 font-medium">{message}</p>}
                    {error   && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button
                    onClick={markAttendance}
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition font-semibold shadow-sm"
                >
                    ✅ Mark Present
                </button>
            </div>

            {/* Total summary */}
            {myTotal > 0 && (
                <div className="bg-green-50 border border-green-100 px-6 py-4 rounded-2xl flex justify-between items-center">
                    <p className="text-gray-600 font-medium">Total days present (all time)</p>
                    <p className="text-2xl font-bold text-green-600">{myTotal} days</p>
                </div>
            )}

            {/* Month picker */}
            <MonthPicker
                allMonthKeys={myMonthKeys}
                selectedMonth={myMonth}
                onChange={setMyMonth}
            />

            {/* Calendar */}
            <MonthCalendar
                monthKey={myMonth}
                dates={myVisibleDates}
            />

            {myVisibleDates.length === 0 && myAttendance.length > 0 && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <p className="text-gray-400">No attendance records for {formatMonthKey(myMonth)}</p>
                </div>
            )}

            {myAttendance.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <p className="text-4xl mb-3">📅</p>
                    <p className="text-gray-500 font-medium">No attendance records yet</p>
                    <p className="text-gray-400 text-sm mt-1">Mark your first attendance above.</p>
                </div>
            )}
        </div>
    );
}

export default AttendancePage;
