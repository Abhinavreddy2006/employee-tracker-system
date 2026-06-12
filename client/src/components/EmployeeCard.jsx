function EmployeeCard({ employee, deleteEmployee }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                        {employee.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{employee.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">{employee.email}</p>
                        <div className="mt-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {employee.position || "Employee"}
                            </span>
                        </div>
                    </div>
                </div>

                {deleteEmployee && (
                    <button
                        onClick={() => deleteEmployee(employee._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default EmployeeCard;
