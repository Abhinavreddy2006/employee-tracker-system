import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchData = async () => {
      try {

        const response = await axios.get(
          "http://localhost:5000/api/test"
        );

        setMessage(response.data.message);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

  }, []);

  return (
    <div>
      <h1>Employee Tracker System</h1>

      <h2>{message}</h2>
    </div>
  );
}

export default App;