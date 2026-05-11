import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import AnalyticsChart from "../components/AnalyticsChart";
import EmployeeTable from "../components/EmployeeTable";

function AdminDashboard() {
  const [stats, setStats] = useState({});

  const [employeeStats, setEmployeeStats] = useState({});

  const [attendanceStats, setAttendanceStats] = useState({});

  const [employees, setEmployees]
    = useState([]);

    const [search, setSearch]
    = useState("");


    const filteredEmployees =
    employees.filter((employee) =>
        employee.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


  const fetchStats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.get(
        "http://localhost:5000/api/tasks/stats",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeStats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.get(
        "http://localhost:5000/api/employees/stats",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setEmployeeStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.get(
        "http://localhost:5000/api/attendance/stats",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setAttendanceStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployees = async () => {

    try {

        const userInfo = JSON.parse(
            localStorage.getItem("userInfo")
        );



        const response = await axios.get(
            "http://localhost:5000/api/employees",
            {
                headers: {
                    Authorization:
                        `Bearer ${userInfo.token}`,
                },
            }
        );



        setEmployees(response.data);

    } catch (error) {

        console.log(error);

    }
};


  useEffect(() => {
    fetchStats();

    fetchEmployeeStats();

    fetchAttendanceStats();

    fetchEmployees();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-8 flex gap-6 flex-wrap">
          <DashboardCard title="Total Tasks" value={stats.totalTasks} />

          <DashboardCard title="Completed Tasks" value={stats.completedTasks} />

          <DashboardCard title="Pending Tasks" value={stats.pendingTasks} />

          <DashboardCard title="In Progress" value={stats.inProgressTasks} />

          <DashboardCard
            title="Total Employees"
            value={employeeStats.totalEmployees}
          />

          <DashboardCard
            title="Attendance Records"
            value={attendanceStats.totalAttendance}
          />

          <div className="w-full">
            <AnalyticsChart stats={stats} />

            <div className="w-full">

              <input
    type="text"
    placeholder="Search Employee"
    value={search}
    onChange={(e) =>
        setSearch(e.target.value)
    }
    className="border p-3 rounded mb-4 w-full"
/>

    <EmployeeTable
        employees={filteredEmployees}
    />

</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
