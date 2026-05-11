function EmployeeTable({
    employees,
}) {

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full overflow-x-auto">

            <h2 className="text-2xl font-bold mb-6">
                Employees
            </h2>



            <table className="w-full border-collapse">

                <thead>

                    <tr className="bg-slate-200">

                        <th className="p-3 text-left">
                            Name
                        </th>

                        <th className="p-3 text-left">
                            Email
                        </th>

                        <th className="p-3 text-left">
                            Position
                        </th>

                    </tr>

                </thead>



                <tbody>

                    {
                        employees.map((employee) => (

                            <tr
                                key={employee._id}
                                className="border-b"
                            >

                                <td className="p-3">
                                    {employee.name}
                                </td>

                                <td className="p-3">
                                    {employee.email}
                                </td>

                                <td className="p-3">
                                    {employee.position}
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