import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";

function AdminDashboard() {
  const [stats, setStats] = useState({});

  const [employeeStats, setEmployeeStats] = useState({});

  const [attendanceStats, setAttendanceStats] = useState({});

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

  useEffect(() => {
    fetchStats();

    fetchEmployeeStats();

    fetchAttendanceStats();
  }, []);

  return (
    <div>
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            padding: "20px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
