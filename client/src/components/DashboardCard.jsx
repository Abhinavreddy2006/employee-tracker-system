function DashboardCard({
    title,
    value,
}) {

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-64">

            <h3 className="text-gray-500 text-lg">
                {title}
            </h3>



            <h1 className="text-4xl font-bold mt-4">
                {value}
            </h1>

        </div>
    );
}

export default DashboardCard;