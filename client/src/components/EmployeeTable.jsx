function EmployeeTable({ employees }) {
    if (!employees || employees.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center py-12">
                <p className="text-gray-400 text-lg">No employees found</p>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 pt-7 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
                <p className="text-gray-400 text-sm mt-1">{employees.length} employee{employees.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-y border-slate-100">
                            <th className="text-left py-3 px-8 text-sm font-semibold text-slate-500">#</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, i) => (
                            <tr key={emp._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                <td className="py-4 px-8 text-gray-400 text-sm">{i + 1}</td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                                            {emp.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-800">{emp.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-500 text-sm">{emp.email}</td>
                                <td className="py-4 px-4">
                                    {emp.position
                                        ? <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{emp.position}</span>
                                        : <span className="text-gray-300 text-xs">—</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default EmployeeTable;
