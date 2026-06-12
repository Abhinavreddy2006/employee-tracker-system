import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");



    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(

                "http://localhost:5000/api/auth/login",

                formData
            );



            login(res.data);



            // ROLE BASED REDIRECT
            if (res.data.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/employee");
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">

                    Login

                </h1>



                {error && (

                    <p className="text-red-500 mb-4">

                        {error}

                    </p>
                )}



                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 mb-4 rounded"
                        required
                    />



                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 mb-4 rounded"
                        required
                    />



                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded"
                    >

                        Login

                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;