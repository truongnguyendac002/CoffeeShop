import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../store/cartSlice";



const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();


  const [status, setStatus] = useState(queryParams.get("status"));
  const txnRef = queryParams.get("txnRef");
  const transactionNo = queryParams.get("transactionNo");
  const amount = queryParams.get("amount");
  const payDateString = queryParams.get("payDate");

  let payDate = null;
  if (payDateString) {
    const moment = require("moment");
    payDate = moment(payDateString, "YYYYMMDDHHmmss").format("YYYY-MM-DD[T]HH:mm:ss");
    console.log("Formatted Date:", payDate);
  }

  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {

    const handleOrderProcessing = async () => {
      const handleDeleteCartItem = async (itemId) => {
        try {
          const response = await fetchWithAuth(
            summaryApi.deleteCartItem.url + itemId,
            {
              method: summaryApi.deleteCartItem.method,
            }
          );
          const result = await response.json();
          if (result.respCode === "000") {
            dispatch(removeFromCart(itemId));
          }
        } catch (error) {
          console.error("Error delete cart item:", error);
        }
      };

      const order = JSON.parse(localStorage.getItem("order"));

      if (status === "success" && order) {
        try {
          const addOrderResponse = await fetchWithAuth(summaryApi.addOrder.url, {
            method: summaryApi.addOrder.method,
            body: JSON.stringify(order),
          });
          const responseOrder = await addOrderResponse.json();

          if (responseOrder.respCode === "000") {
            toast.success("Đặt hàng thành công");

            order.OrderItems.forEach((orderItem) => {
              const cartItem = cartItems.find(
                (item) => item.productItemResponse.id === orderItem.ProductItemId
              );
              if (cartItem) {
                handleDeleteCartItem(cartItem.id);
              }
            });

            if (txnRef) {
              try {
                const addTransactionResponse = await fetchWithAuth(
                  summaryApi.addTransaction.url,
                  {
                    method: summaryApi.addTransaction.method,
                    body: JSON.stringify({
                      TransactionNo: transactionNo,
                      TxnRef: txnRef,
                      PayDate: payDate,
                      Amount: amount,
                      OrderId: responseOrder.data,
                    }),
                  }
                );
                const responseTran = await addTransactionResponse.json();

                // if (responseTran.respCode !== "000") {
                //   throw new Error("Giao dịch không thành công");
                // }
              } catch (error) {
                console.error("Giao dịch không thành công");
                // setStatus("fail");
                // return;
              }
            }
          } else {
            throw new Error("Đặt hàng không thành công");
          }
        } catch (error) {
          console.error("Có lỗi xảy ra khi xử lý đơn hàng:", error);
          toast.error("Đặt hàng không thành công");
          setStatus("fail");
        } finally {
          localStorage.removeItem("order");
        }
      }
    };
    handleOrderProcessing();

  }, [amount, dispatch, payDate, status, transactionNo, txnRef]);


  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      {status === "success" ? (
        <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-md text-center">
          <div className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mt-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-700 mt-2">
            Cảm ơn bạn đã đặt hàng. Mọi thắc mắc xin liên hệ với chúng tôi để được hỗ trợ!
          </p>
          <div className="mt-6 space-x-4">
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Tiếp tục mua hàng
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-md text-center">
          <div className="text-red-500">
            <svg
              className="w-16 h-16 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mt-4">
            Đặt hàng không thành công!
          </h1>
          <p className="text-gray-700 mt-2">
            Rất tiếc, đơn hàng đặt không thành công. Vui lòng thử lại hoặc liên
            hệ với chúng tôi để được hỗ trợ.
          </p>
          <div className="mt-6">
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
