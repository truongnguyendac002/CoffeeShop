import React, { useCallback, useEffect, useState } from "react";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";
import OrderTable from "./OrderTable";

const highlightText = (text, searchTerm) => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span
        key={index}
        style={{ backgroundColor: "yellow", fontWeight: "bold" }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

const formatOrderDate = (orderDate) => {
  const dateObj = new Date(orderDate);
  if (isNaN(dateObj)) return ""; 
  const formatDate = dateObj.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formatTime = dateObj.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "numeric",
  });

  return `${formatDate} ${formatTime}`;
};

const OrderProgress = ({ progress }) => {
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrderProgress = useCallback(async () => {
    try {
      const response = await fetchWithAuth(
        summaryApi.getOrderByStatus.url + `${progress}`,
        {
          method: summaryApi.getOrderByStatus.method,
        }
      );
  
      const result = await response.json();
      if (result.respCode === "000") {
        setOrderList(result.data);
      } else {
        console.log("error get order Progress ");
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [progress]);
  

  useEffect(() => {
    fetchOrderProgress();
  }, [fetchOrderProgress]);

  useEffect(() => {
    const search = () => {
      if (searchTerm.trim() === "") {
        setFilteredOrders(orderList);
      } else {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        const filtered = orderList.filter((order) => {
          const orderId = order.orderId
            ? order.orderId.toString().toLowerCase()
            : "";
          const customerName = order.shippingAddress.receiverName
            ? order.shippingAddress.receiverName.toLowerCase()
            : "";
          const orderDate = order.orderDate
            ? formatOrderDate(order.orderDate)
            : "";
          return (
            orderId.includes(lowerCaseSearchTerm) ||
            customerName.includes(lowerCaseSearchTerm) ||
            orderDate.includes(lowerCaseSearchTerm)
          );
        });
        setFilteredOrders(filtered);
      }
    };

    search();
  }, [searchTerm, orderList]);

  const refreshOrderList = () => {
    fetchOrderProgress();
  };

  return (
    <>
      <div className="bg-white py-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc tên người khách hàng ngày tạo đơn hàng "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <OrderTable
        orderList={filteredOrders.map((order) => ({
          ...order,
          highlightedOrderId: highlightText(
            order.orderId?.toString() || "",
            searchTerm
          ),
         
        }))}
        refreshOrderList={refreshOrderList}
      />
    </>
  );
};

export default OrderProgress;
