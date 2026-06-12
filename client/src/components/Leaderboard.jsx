import { useEffect, useState } from "react";
import axios from "axios";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = [
    "bg-yellow-50 border-yellow-200",
    "bg-slate-50  border-slate-200",
    "bg-orange-50 border-orange-200",
];

function Leaderboard() {
    const [employees, setEmployees] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const headers  = { Authorization: `Bearer ${userInfo?.token}` };

    useEffect(() => {
        axios.get("http://localhost:5000/api/tasks/leaderboard", { headers })
            .then(r => setEmployees(r.data))
            .catch(console.log);
    }, []);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Productivity Leaderboard</h2>
            <p className="text-gray-400 text-sm mb-6">Ranked by task completion rate</p>

            {employees.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No data yet — assign tasks to employees first.</p>
            ) : (
                <div className="space-y-3">
                    {employees.map((emp, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${RANK_COLORS[i] || "bg-slate-50 border-slate-100"}`}>
                            <span className="text-2xl w-8 text-center">{MEDALS[i] || `${i + 1}`}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{emp.name}</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${emp.score}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-xl font-bold text-blue-600 flex-shrink-0">{emp.score}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Leaderboard;
