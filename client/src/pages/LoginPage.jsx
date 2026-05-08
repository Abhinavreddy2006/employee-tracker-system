import { useState } from "react";
import axios from "axios";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const loginHandler = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );



            // STORE TOKEN
            localStorage.setItem(
                "token",
                response.data.token
            );



            alert("Login Successful");
            window.location.reload();

            console.log(response.data);

        } catch (error) {

            console.log(error);

            alert("Invalid Credentials");

        }
    };



    return (
        <div>

            <h1>Login Page</h1>

            <form onSubmit={loginHandler}>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default LoginPage;