import React, { useState } from "react";
import RevenueChart from "./RevenueChart";
import ProductChart from "./ProductChart";
import UserChart from "./UserChart";

const Statistics = () => {
  const [activeTab, setActiveTab] = useState("Thống kê doanh thu");
  const keyTab = [
    "Thống kê doanh thu",
    "Thống kê sản phẩm",
    "Thống kê người dùng",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Thống kê doanh thu":
        return <RevenueChart />;
      case "Thống kê sản phẩm":
        return <ProductChart />;
      case "Thống kê người dùng":
        return <UserChart />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 ">
      <ul className="flex justify-start border-b">
        {keyTab.map((tab, index) => (
          <li
            key={index}
            className={`px-6 py-3 cursor-pointer ${
              activeTab === tab ? "text-red-500 border-b-2 border-red-500" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>

      <div className="bg-gray-50 rounded-lg p-6">{renderContent()}</div>
    </div>
  );
};

export default Statistics;
