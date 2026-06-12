import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeCard from "../components/EmployeeCard";

function EmployeesPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = userInfo?.role === "admin";
    const headers = { Authorization: `Bearer ${userInfo?.token}` };

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", position: "" });
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/employees", { headers });
            setEmployees(res.data);
        } catch (e) { console.log(e); }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`, { headers });
            fetchEmployees();
        } catch (e) { console.log(e); }
    };

    const addEmployee = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");
        try {
            await axios.post("http://localhost:5000/api/auth/register",
                { ...formData, role: "employee" },
                { headers }
            );
            setFormSuccess("Employee added successfully!");
            setFormData({ name: "", email: "", password: "", position: "" });
            setShowForm(false);
            fetchEmployees();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to add employee");
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        (emp.position || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Employees</h1>
                    <p className="text-gray-500 mt-2">Manage your team members ({employees.length} total)</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition"
                    >
                        {showForm ? "Cancel" : "+ Add Employee"}
                    </button>
                )}
            </div>

            {/* Add Employee Form */}
            {showForm && isAdmin && (
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
                    {formError && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{formError}</p>}
                    {formSuccess && <p className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg">{formSuccess}</p>}
                    <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 border rounded-xl"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-4 border rounded-xl"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-4 border rounded-xl"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Position (e.g. Developer)"
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                            className="w-full p-4 border rounded-xl"
                        />
                        <button
                            type="submit"
                            className="md:col-span-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
                        >
                            Add Employee
                        </button>
                    </form>
                </div>
            )}

            {/* Search */}
            <input
                type="text"
                placeholder="Search employees by name, email or position..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full p-4 border rounded-xl"
            />

            {/* Employee Grid */}
            {filteredEmployees.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xl">No employees found</p>
                    {isAdmin && <p className="text-gray-400 mt-2">Add employees using the button above.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEmployees.map(employee => (
                        <EmployeeCard
                            key={employee._id}
                            employee={employee}
                            deleteEmployee={isAdmin ? deleteEmployee : null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EmployeesPage;
