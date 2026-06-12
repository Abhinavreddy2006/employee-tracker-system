function DashboardCard({ title, value, sub, color = "blue" }) {
    const colors = {
        blue:   "bg-blue-50  border-blue-200  text-blue-600",
        green:  "bg-green-50 border-green-200 text-green-600",
        red:    "bg-red-50   border-red-200   text-red-600",
        yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        slate:  "bg-slate-50  border-slate-200  text-slate-600",
    };
    return (
        <div className={`flex-1 min-w-[140px] p-6 rounded-2xl border-2 shadow-sm hover:shadow-md transition ${colors[color]}`}>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <h2 className="text-4xl font-bold mt-2 text-slate-800">{value}</h2>
            {sub && <p className="text-xs mt-1 text-gray-400">{sub}</p>}
        </div>
    );
}
export default DashboardCard;
