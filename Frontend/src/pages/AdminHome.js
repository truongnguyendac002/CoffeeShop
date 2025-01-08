import { Outlet } from "react-router-dom";
import Sidebar from "../components/adminpage/layout/sidebar";
import Topbar from "../components/adminpage/layout/topbar";
const AdminHome = () => {
    return (
        <>
            <Topbar />
            <div className="relative">
                {/* Sidebar */}
                <div className="fixed top-[60px] left-0 w-1/6 h-screen bg-gray-100">
                    <Sidebar />
                </div>

                {/* Nội dung chính */}
                <div className="ml-[16.67%] pt-5 pl-5 bg-white">
                    <Outlet />
                </div>
            </div>
        </>
    );
};


export default AdminHome;
