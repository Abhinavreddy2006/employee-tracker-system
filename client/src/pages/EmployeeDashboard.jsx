import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.get(
        "http://localhost:5000/api/tasks/mytasks",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.patch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const markAttendance = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Attendance Marked");

      console.log(response.data);
    } catch (error) {
      console.log(error);

      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <button onClick={markAttendance}>Mark Attendance</button>

      {tasks.map((task) => (
        <div key={task._id}>
          <h2>{task.title}</h2>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>

          <button onClick={() => updateStatus(task._id, "In Progress")}>
            In Progress
          </button>

          <button onClick={() => updateStatus(task._id, "Completed")}>
            Completed
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default EmployeeDashboard;
