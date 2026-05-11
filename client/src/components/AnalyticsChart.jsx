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
        <div className="bg-white p-6 rounded-xl shadow-md w-full">

            <h2 className="text-2xl font-bold mb-6">
                Task Analytics
            </h2>



            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart data={data}>

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="value" />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default AnalyticsChart;