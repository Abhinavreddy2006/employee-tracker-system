import axios from "axios";

const API_URL =
    "http://localhost:5000/api/auth";



const loginUser = async (userData) => {

    const response = await axios.post(
        `${API_URL}/login`,
        userData
    );



    localStorage.setItem(
        "userInfo",
        JSON.stringify(response.data)
    );



    return response.data;
};

export {
    loginUser,
};