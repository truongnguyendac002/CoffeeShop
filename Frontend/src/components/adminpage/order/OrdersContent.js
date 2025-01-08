import React, { useState } from "react";
import AllOrder from "./AllOrder";
import OrderProgress from "./OrderProgress";

const OrdersContent = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const keyTab = [
    "Tất cả",
    "Chưa xác nhận",
    "Đã xác nhận",
    "Đang giao hàng ",
    "Hoàn thành",
    "Đã hủy",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Tất cả":
        return <AllOrder />;
      case "Chưa xác nhận":
        return <OrderProgress progress={"Processing"} />;
      case "Đã xác nhận":
        return <OrderProgress progress={"Processed"} />;
      case "Đang giao hàng ":
        return <OrderProgress progress={"Shipping"} />;
      case "Hoàn thành":
        return <OrderProgress progress={"Completed"} />;
      case "Đã hủy":
        return <OrderProgress progress={"Cancelled"} />;
      default:
        return <p>Nội dung mặc định</p>;
    }
  };

  return (
    <div className=" min-h-screen">
     
      <div className="bg-white shadow-md ">
        <div className="container mx-auto">
          <ul className="flex justify-start border-b">
            {keyTab.map((tab, index) => (
              <li
                key={index}
                className={`px-6 py-3 cursor-pointer ${
                  activeTab === tab
                    ? "text-red-500 border-b-2 border-red-500"
                    : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </div>

      

      <div className="">{renderContent()}</div>
    </div>
  );
};

export default OrdersContent;
