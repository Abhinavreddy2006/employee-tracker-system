import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import TaskCard from "../components/TaskCard";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [productivity,
    setProductivity]
    = useState({});

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

  const fetchProductivity =
    async () => {

        try {

            const userInfo = JSON.parse(
                localStorage.getItem(
                    "userInfo"
                )
            );



            const response =
                await axios.get(
                    "http://localhost:5000/api/tasks/productivity",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${userInfo.token}`,
                        },
                    }
                );



            setProductivity(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
};

  useEffect(() => {
    fetchTasks();
    fetchProductivity();
  }, []);


 return (
    <DashboardLayout>

        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">

                        Employee Dashboard

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Track your productivity and tasks

                    </p>

                </div>



                <button
                    onClick={markAttendance}
                    className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600"
                >
                    Mark Attendance
                </button>

            </div>



            {/* ADD PRODUCTIVITY CARD HERE */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">

                <h2 className="text-2xl font-bold">

                    Productivity Score

                </h2>



                <h1 className="text-6xl font-bold text-blue-600 mt-4">

                    {productivity.productivity}%

                </h1>



                <p className="text-gray-500 mt-4">

                    Completed
                    {" "}
                    {productivity.completedTasks}
                    {" "}
                    out of
                    {" "}
                    {productivity.totalTasks}
                    {" "}
                    tasks

                </p>

            </div>



            {/* TASK GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {
                    tasks.map((task) => (

                        <TaskCard
                            key={task._id}
                            task={task}
                        />

                    ))
                }

            </div>

        </div>

    </DashboardLayout>
);
}

export default EmployeeDashboard;
