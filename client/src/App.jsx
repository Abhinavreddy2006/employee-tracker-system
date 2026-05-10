import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );



  return (
    <div>

      {
        !userInfo ? (
          <LoginPage />
        ) : userInfo.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <EmployeeDashboard />
        )
      }

    </div>
  );
}

export default App;