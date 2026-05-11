import { useState } from "react";
import { loginUser } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      await loginUser({
        email,
        password,
      });

      alert("Login Successful");
      window.location.reload();

      console.log(response.data);
    } catch (error) {
      console.log(error);

      alert("Invalid Credentials");
    }
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <form
            onSubmit={loginHandler}
            className="bg-white p-8 rounded-xl shadow-md w-96"
        >

            <h1 className="text-3xl font-bold mb-6 text-center">
                Login
            </h1>



            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded mb-4"
            />



            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded mb-4"
            />



            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
                Login
            </button>

        </form>

    </div>
);
}

export default LoginPage;
