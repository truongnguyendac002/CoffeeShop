import React, { useCallback, useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";

const AllOrder = () => {
  const [orderList, setOrderList] = useState([]);

  const fetchAllOrder = useCallback (async () => {
    const response = await fetchWithAuth(summaryApi.getAllOrder.url, {
      method: summaryApi.getAllOrder.method,
    });

    const result = await response.json();

    if (result.respCode === "000") {
      setOrderList(result.data);
    } else {
      console.log("error get all order");
    }
  },[]
) 

  useEffect(() => {
    fetchAllOrder();
  }, [fetchAllOrder]);

  const refreshOrderList = () => {
    fetchAllOrder();
  };


  return (
    <div className="mt-12">
      <OrderTable orderList={orderList}  refreshOrderList={refreshOrderList} />
    </div>
  );
};

export default AllOrder;
