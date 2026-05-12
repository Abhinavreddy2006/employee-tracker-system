import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({
    children,
}) {

    return (
        <div className="bg-slate-100 min-h-screen">

            <Navbar />



            <div className="flex">

                <Sidebar />



                <div className="flex-1 p-8">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;