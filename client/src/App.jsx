import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";

function App() {

  const token = localStorage.getItem("token");

  return (
    <div>

      {
        token ? <EmployeePage /> : <LoginPage />
      }

    </div>
  );
}

export default App;