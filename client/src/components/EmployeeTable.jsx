function EmployeeTable({
    employees,
}) {

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm overflow-x-auto">

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-slate-800">

                    Employees

                </h2>

                <p className="text-gray-500 mt-2">

                    Manage your team members

                </p>

            </div>



            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-4">

                            Name

                        </th>

                        <th className="text-left py-4">

                            Email

                        </th>

                        <th className="text-left py-4">

                            Position

                        </th>

                    </tr>

                </thead>



                <tbody>

                    {
                        employees.map((employee) => (

                            <tr
                                key={employee._id}
                                className="border-b hover:bg-slate-50 transition"
                            >

                                <td className="py-5">

                                    {employee.name}

                                </td>

                                <td>

                                    {employee.email}

                                </td>

                                <td>

                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                                        {employee.position}

                                    </span>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeTable;