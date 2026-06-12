import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import AnalyticsChart from "../components/AnalyticsChart";
import EmployeeTable from "../components/EmployeeTable";
import DashboardLayout from "../components/DashboardLayout";
import Leaderboard from "../components/Leaderboard";
import ActivityFeed from "../components/ActivityFeed";
import NotificationPanel from "../components/NotificationPanel";

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
    <DashboardLayout>

        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold text-slate-800">

                    Admin Dashboard

                </h1>

                <p className="text-gray-500 mt-2">

                    Monitor productivity and manage employees

                </p>

            </div>



            <div className="flex gap-6 flex-wrap">

                <DashboardCard
                    title="Total Tasks"
                    value={stats.totalTasks}
                />



                <DashboardCard
                    title="Completed Tasks"
                    value={stats.completedTasks}
                />



                <DashboardCard
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                />



                <DashboardCard
                    title="In Progress"
                    value={stats.inProgressTasks}
                />



                <DashboardCard
                    title="Total Employees"
                    value={employeeStats.totalEmployees}
                />



                <DashboardCard
                    title="Attendance Records"
                    value={attendanceStats.totalAttendance}
                />

            </div>



            <AnalyticsChart stats={stats} />

            <Leaderboard />

            <ActivityFeed />

            <NotificationPanel />

            <div>

                <input
                    type="text"
                    placeholder="Search Employee"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full p-4 rounded-xl border mb-6"
                />



                <EmployeeTable
                    employees={filteredEmployees}
                />

            </div>

        </div>

    </DashboardLayout>
);
}

export default AdminDashboard;
