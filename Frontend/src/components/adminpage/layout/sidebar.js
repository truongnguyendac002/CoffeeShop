import React from "react";
import {
  MdPermIdentity,
  MdStore,
  MdBarChart,
  MdChatBubbleOutline,
} from "react-icons/md";
import { LiaClipboardListSolid } from "react-icons/lia";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex-1 bg-white shadow-md h-[calc(100vh-60px)] shadow-gray-400 sticky w-[254.663px]">
      <div className="p-5 text-gray-600">

        {/* Quick Menu */}
        <div className="mb-3">
          <h3 className="text-sm text-gray-400">Dashboard</h3>
          <ul className="list-none p-1">
            <NavLink
              to="users"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdPermIdentity className="mr-2 text-lg" />
              Users
            </NavLink>

            <NavLink
              to="products"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdStore className="mr-2 text-lg" />
              Products
            </NavLink>

            <NavLink
              to="brands"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdStore className="mr-2 text-lg" />
              Nhãn hàng
            </NavLink>

            <NavLink
              to="categories"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdStore className="mr-2 text-lg" />
              Danh mục
            </NavLink>

            <NavLink
              to="orders"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <LiaClipboardListSolid className="mr-2 text-lg" />
              Đơn hàng
            </NavLink>

            <NavLink
              to="statistics"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdBarChart className="mr-2 text-lg" />
              Thống kê
            </NavLink>
          </ul>
        </div>

        {/* Notifications */}
        <div className="mb-3">
          <h3 className="text-sm text-gray-400">Notifications</h3>
          <ul className="list-none p-1">
            
            <NavLink
              to="messages"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center p-2 mb-1 rounded-lg bg-indigo-100 transition-all duration-300 ease-in-out transform scale-105"
                  : "flex items-center p-2 mb-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out"
              }
            >
              <MdChatBubbleOutline className="mr-2 text-lg" />
              Messages
            </NavLink>
          </ul>
        </div>

        
      </div>
    </div>
  );
};

export default Sidebar;
