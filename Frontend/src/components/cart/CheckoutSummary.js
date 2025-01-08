import React, { useEffect, useMemo } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import summaryApi from "../../common";
import fetchWithAuth from "../../helps/fetchWithAuth";
import { Radio } from "antd";

const CheckoutSummary = ({ selectedAddress }) => {
  const cartItems = useSelector((store) => store.cart.items);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shipping, setShipping] = useState(0);
  
  const navigate = useNavigate();

  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => item.isSelected);
  }, [cartItems]);

  useEffect(() => {
    if (selectedAddress) {
      setShipping(10000);
    } else {
      setShipping(0);
    }
  }, [selectedAddress]);

  const subtotal = selectedItems
    ? selectedItems.reduce(
        (sum, item) => sum + item.productItemResponse.price * item.quantity,
        0
      )
    : 0;

  const discount = selectedItems
    ? selectedItems.reduce((sum, item) => {
        return sum + item.productItemResponse.discount * item.quantity;
      }, 0)
    : 0;

  const total = subtotal + shipping - discount;

  // Thuc lam tu day
  const handleCheckout = async () => {
    const order = {
      OrderItems: selectedItems.map((item) => ({
        ProductItemId: item.productItemResponse.id,
        Amount: item.quantity,
        Price: item.productItemResponse.price,
        Discount: item.productItemResponse.discount,
      })),
      ShippingAddressId: selectedAddress,
      PaymentMethod: paymentMethod,
    };

    localStorage.setItem("order", JSON.stringify(order));

    try {
      if (paymentMethod === "COD") {
        navigate("/order-status?status=success");
      } else if (paymentMethod === "VNPay") {
        const createOnlinePayment = await fetchWithAuth(
          summaryApi.createOnlinePayment.url + `?amount=${total}`,
          {
            method: summaryApi.createOnlinePayment.method,
          }
        );

        const response = await createOnlinePayment.json();
        if (response.respCode === "000") {
          window.location.href = response.data.URL;
        } else {
          navigate("/order-status?status=fail");
        }
      }
    } catch (error) {}
  };

  return (
    <Card className="bg-white text-gray-800 shadow-md border border-gray-300">
      <div className="space-y-4">
        <div className=" flex text-lg font-semibold justify-between">
          <h3 className=" text-gray-700">Subtotal (items):</h3>
          <p className="text-gray-800">{selectedItems.length}</p>
        </div>

        <div className="flex text-lg font-semibold justify-between">
          <h3 className=" text-gray-700">Price (Total):</h3>
          <p className="text-gray-800">
            {Number(subtotal).toLocaleString("vi-VN")}đ
          </p>
        </div>

        <div className="flex text-lg font-semibold justify-between">
          <h3 className=" text-gray-700">Shipping:</h3>
          <p className="text-gray-800">
            {Number(shipping).toLocaleString("vi-VN")}đ
          </p>
        </div>

        <div className="flex md:text-lg text-base font-semibold justify-between">
          <h3 className=" text-gray-700">Discount:</h3>
          <p className="text-gray-800">
            {Number(discount).toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>
      <hr className="border-t border-gray-300 mt-6"></hr>

      <div className="my-6 flex justify-between text-lg font-bold text-gray-800">
        <h3>Total:</h3>
        <p>{Number(total).toLocaleString("vi-VN")} đ</p>
      </div>

      <div className="mb-4">
        <h3 className="text-gray-700 font-bold text-lg">Payment Method:</h3>
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="flex flex-col mt-2 space-y-2"
        >
          <Radio value="COD">Cash on Delivery</Radio>
          <Radio value="VNPay">Online Payment (VNPay)</Radio>
        </Radio.Group>
      </div>

      <button
        disabled={subtotal <= 0 || !selectedAddress}
        className={`w-full py-2 text-lg font-semibold rounded-md mt-2  text-black 
          ${
            subtotal <= 0 || !selectedAddress
              ? "bg-yellow-400 cursor-not-allowed opacity-50"
              : "bg-yellow-300 hover:bg-yellow-400  hover:text-black"
          }`}
        onClick={handleCheckout}
      >
        Complete Checkout
      </button>
    </Card>
  );
};

export default CheckoutSummary;
