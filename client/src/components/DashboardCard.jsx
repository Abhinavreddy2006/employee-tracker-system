function DashboardCard({
    title,
    value,
}) {

    return (
        <div className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition w-72">

            <p className="text-gray-500 text-lg">

                {title}

            </p>



            <h1 className="text-5xl font-bold mt-5 text-slate-800">

                {value}

            </h1>

        </div>
    );
}

export default DashboardCard;