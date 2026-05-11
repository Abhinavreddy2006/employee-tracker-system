function Sidebar() {

    return (
        <div className="w-64 min-h-screen bg-slate-800 text-white p-6">

            <h2 className="text-2xl font-bold mb-8">
                Dashboard
            </h2>



            <div className="space-y-4">

                <p className="hover:text-blue-400 cursor-pointer">
                    Tasks
                </p>

                <p className="hover:text-blue-400 cursor-pointer">
                    Attendance
                </p>

                <p className="hover:text-blue-400 cursor-pointer">
                    Employees
                </p>

            </div>

        </div>
    );
}

export default Sidebar;