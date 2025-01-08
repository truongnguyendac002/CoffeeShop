import React from "react";
import { Badge, Avatar, Dropdown } from "antd";
import { MdNotificationsNone, MdLanguage, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../store/userSlice";
import Cookies from "js-cookie";
import { message } from "antd";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    localStorage.removeItem("shipping-address");
    dispatch(clearUser());
    navigate("/login");
    message.success("Logout Successfully!");
  };

  return (
    <div className="w-full h-[60px] bg-white sticky top-0 z-[999] shadow-sm">
      <div className="h-full px-5 flex items-center justify-between">
        <div className="font-bold text-2xl text-blue-700 cursor-pointer">
          shopAdmin
        </div>
        <div className="flex items-center space-x-4">
          <Avatar
            size={40}
            src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            className="object-cover"
          />

          <div>
            <button
              onClick={handleLogout}
              className="rounded-full  px-5 py-1 text-white text-lg shadow-lg bg-gradient-to-r
                 from-teal-500 via-teal-400 to-teal-500 transition-all duration-500 ease-in-out bg-[length:200%_auto]
                  hover:bg-[position:right_center]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
