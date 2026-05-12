function Sidebar() {

    return (
        <div className="w-72 min-h-screen bg-slate-900 text-white p-6">

            <h2 className="text-3xl font-bold mb-10">
                WorkSphere
            </h2>



            <div className="space-y-3">

                <div className="bg-slate-800 p-4 rounded-lg cursor-pointer hover:bg-blue-500 transition">

                    Dashboard

                </div>



                <div className="p-4 rounded-lg cursor-pointer hover:bg-slate-800 transition">

                    Employees

                </div>



                <div className="p-4 rounded-lg cursor-pointer hover:bg-slate-800 transition">

                    Tasks

                </div>



                <div className="p-4 rounded-lg cursor-pointer hover:bg-slate-800 transition">

                    Attendance

                </div>

            </div>

        </div>
    );
}

export default Sidebar;