import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function AnalyticsChart({ stats }) {

    const data = [
        {
            name: "Completed",
            value: stats.completedTasks || 0,
        },
        {
            name: "Pending",
            value: stats.pendingTasks || 0,
        },
        {
            name: "In Progress",
            value: stats.inProgressTasks || 0,
        },
    ];



return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">

        <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-800">

                Task Analytics

            </h2>

            <p className="text-gray-500 mt-2">

                Overview of task performance

            </p>

        </div>



        <ResponsiveContainer
            width="100%"
            height={350}
        >

            <BarChart data={data}>

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                    dataKey="value"
                    radius={[10, 10, 0, 0]}
                />

            </BarChart>

        </ResponsiveContainer>

    </div>
);
}

export default AnalyticsChart;