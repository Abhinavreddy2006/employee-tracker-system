function Navbar() {

    const logoutHandler = () => {

        localStorage.removeItem("userInfo");

        window.location.reload();
    };



    return (
        <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

            <h1 className="text-2xl font-bold">
                Employee Tracker
            </h1>



            <button
                onClick={logoutHandler}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>

        </div>
    );
}

export default Navbar;