import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BAR_COLORS = {
    Completed:   "#22c55e",
    "In Progress": "#3b82f6",
    Pending:     "#94a3b8",
};

function AnalyticsChart({ stats }) {
    const data = [
        { name: "Completed",   value: stats.completedTasks   || 0 },
        { name: "In Progress", value: stats.inProgressTasks  || 0 },
        { name: "Pending",     value: stats.pendingTasks      || 0 },
    ];
    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Task Breakdown</h2>
                    <p className="text-gray-400 text-sm mt-1">Total tasks: {total}</p>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                    {data.map(d => (
                        <span key={d.name} className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: BAR_COLORS[d.name] }} />
                            {d.name}
                        </span>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barSize={60}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b" }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {data.map((d) => (
                            <Cell key={d.name} fill={BAR_COLORS[d.name]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
export default AnalyticsChart;
