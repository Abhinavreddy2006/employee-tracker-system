import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
    children,
    allowedRole,
}) => {

    const { user } = useAuth();



    // NOT LOGGED IN
    if (!user) {

        return <Navigate to="/login" />;
    }



    // ROLE CHECK
    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        return <Navigate to="/" />;
    }



    return children;
};

export default ProtectedRoute;