function Navbar() {

    const logoutHandler = () => {

        localStorage.removeItem("userInfo");

        window.location.reload();
    };



    return (
        <div
            style={{
                backgroundColor: "#222",
                color: "white",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
            }}
        >

            <h2>Employee Tracker System</h2>



            <button onClick={logoutHandler}>
                Logout
            </button>

        </div>
    );
}

export default Navbar;