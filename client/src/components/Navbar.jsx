function Navbar() {

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );



    const logoutHandler = () => {

        localStorage.removeItem("userInfo");

        window.location.reload();
    };



    return (
        <div className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

            <div>

                <h1 className="text-2xl font-bold text-slate-800">

                    Welcome,
                    {" "}
                    {userInfo?.name}

                </h1>

                <p className="text-gray-500">

                    Manage your team's workflow

                </p>

            </div>



            <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>

        </div>
    );
}

export default Navbar;