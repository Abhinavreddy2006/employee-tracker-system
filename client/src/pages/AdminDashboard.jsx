function AdminDashboard() {

    const logoutHandler = () => {

        localStorage.removeItem("userInfo");

        window.location.reload();
    };



    return (
        <div>

            <h1>Admin Dashboard</h1>

            <p>Manage Employees and Tasks</p>



            <button onClick={logoutHandler}>
                Logout
            </button>

        </div>
    );
}

export default AdminDashboard;