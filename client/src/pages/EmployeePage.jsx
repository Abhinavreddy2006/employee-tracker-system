import { useEffect, useState } from "react";
import axios from "axios";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");

      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE EMPLOYEE
  const createEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/employees", {
        name,
        email,
        position,
      });

      fetchEmployees();

      setName("");
      setEmail("");
      setPosition("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);

      fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee Tracker System</h1>

      {/* FORM */}
      <form onSubmit={createEmployee}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Enter Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Add Employee</button>
      </form>

      <hr />

      {/* EMPLOYEE LIST */}
      <h2>Employee List</h2>

      {employees.map((employee) => (
        <div key={employee._id}>
          <h3>{employee.name}</h3>

          <p>{employee.email}</p>

          <p>{employee.position}</p>
          <button onClick={() => deleteEmployee(employee._id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default EmployeePage;
