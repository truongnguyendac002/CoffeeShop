import React, { useEffect, useState } from "react";
import { InputNumber, Button, Checkbox } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common";
import { useDispatch } from "react-redux";
import {
  addToCart,
  toggleSelected,
  removeFromCart,
} from "../../store/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { message } from "antd";
import image1 from "../../assets/img/empty.jpg";
import { Link, useLocation } from "react-router-dom";

const CartItems = ({ cartItems, isCheckingOut }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [errorItemId, setErrorItemId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const newCartItems =  cartItems.filter((item) => item.quantity <= item.productItemResponse.stock )

  const handleQuantityChange = (value, item) => {
    if (value < 1) {  
      triggerError(item);
    } else {
      if(value > item.productItemResponse.stock) {
        value =  item.productItemResponse.stock;
      }
      const updatedItem = { ...item, quantity: value };
      setErrorItemId(null);
      try {
        if (updatedCartItems(updatedItem)) {
          dispatch(addToCart(updatedItem));
        } else console.log("update false");
      } catch (error) {
        toast.error("Error updating cart item");
      }
    }
  };
  const updatedCartItems = async (item) => {
    try {
      const response = await fetchWithAuth(summaryApi.updateCartItem.url, {
        method: summaryApi.updateCartItem.method,
        body: JSON.stringify({
          Quantity: item.quantity,
          ProductItemId: item.productItemResponse.id,
          UserId: item.userId,
        }),
      });
      const result = await response.json();
      if (result.respCode === "000") {
        return true;
      }
    } catch (error) {
      toast.error("Error updating cart item");
      console.error("Error updating cart item:", error);
    }
    return false;
  };

  const triggerError = (item) => {
    setErrorItemId(item.id);
    setTimeout(() => setErrorItemId(null), 500);
  };

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
        message.success("Delete cart item successfully");
        dispatch(removeFromCart(itemId));
      }
    } catch (error) {
      message.error(" Error delete cart item");
      console.error("Error delete cart item:", error);
    }
  };

  const handleSelectItem = (item) => {
    setSelectAll(false);
    dispatch(toggleSelected({ itemId: item.id }));
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    dispatch(toggleSelected({ isSelected: !selectAll }));
  };

  useEffect(() => {
   
    if (newCartItems.length === 0) {
      setSelectAll(false); 
      return;
    }
    const allSelected = newCartItems.every(
      (cartItem) =>  cartItem.isSelected === true
    );
    setSelectAll(allSelected && newCartItems.length > 0);
  }, [newCartItems]);

  useEffect(() => {
    cartItems.forEach((item) => {
      if (item.quantity > item.productItemResponse.stock && item.selected) {
        dispatch(toggleSelected({ itemId: item.id }));
      }
    });
  }, [cartItems, dispatch]); 

  return (
    <div className="space-y-4">
      {location.pathname === "/cart" ? (
        <div className="bg-white rounded-lg shadow-md py-2 px-3">
          <div className="flex items-center  pb-2 font-semibold text-gray-500">
            <div className="w-1/12 flex justify-center ">
              <Checkbox
                type="checkbox"
                className="w-4 h-4"
                checked={selectAll }
                disabled ={newCartItems.length === 0}
                onChange={handleSelectAll}
              />
            </div>
            <div className="w-5/12 flex justify-start">Sản Phẩm</div>
            <div className="sm:w-1/12 w-0  justify-start hidden sm:flex">
              Đơn Giá
            </div>
            <div className="w-3/12 flex justify-center">Số Lượng</div>
            <div className="w-2/12 sm:w-1/12 flex justify-start">Số Tiền</div>
            <div className="w-1/12 flex justify-start">Thao Tác</div>
          </div>
        </div>
      ) : (
        ""
      )}

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md border rounded-md py-4 px-3"
        >
          
          <div className="flex flex-col ">
            <div className="flex flex-row items-center justify-between">
              <div className="w-1/12 flex justify-center ">
                <Checkbox
                  checked={item.isSelected || (item.quantity <= item.productItemResponse.stock && selectAll)}
                  onClick={() => handleSelectItem(item)}
                  disabled={
                    isCheckingOut ||
                    item.quantity > item.productItemResponse.stock
                  }
                  style={{ transform: "scale(1.1)" }}
                />
              </div>
              <div className="w-5/12 ">
                <Link
                  to={`/product/${item.productItemResponse.productResponse.id}`}
                >
                  <div className="flex flex-col items-start sm:flex-row  sm:space-x-3 sm:items-center">
                    <img
                      src={
                        item.productItemResponse.productResponse.images[0]
                          ? item.productItemResponse.productResponse.images[0]
                              .url
                          : image1
                      }
                      alt={item.productItemResponse.productResponse.name}
                      className="w-10 h-10 sm:w-16 sm:h-16 object-cover "
                    />
                    <div>
                      <h2 className="text-sm sm:text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.productItemResponse.productResponse.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Type: {item.productItemResponse.type.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block  ">
                        Category:
                        {item.productItemResponse.productResponse.category.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="w-1/12  text-sm sm:text-base font-semibold hidden sm:block">
                {item.productItemResponse.discount ? (
                  <div className="flex flex-col justify-center">
                    <p className="">
                      {Number(
                        item.productItemResponse.price -
                          item.productItemResponse.discount
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                    <p className="text-gray-500 line-through text-sm font-normal">
                      {Number(item.productItemResponse.price).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </p>
                  </div>
                ) : (
                  <p>
                  
                    {Number(item.productItemResponse.price).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </p>
                )}
              </div>

              <div className="w-3/12 flex items-center justify-center ">
                <Button
                  type="default"
                  icon={<MinusOutlined />}
                  onClick={() => handleQuantityChange(item.quantity - 1, item)}
                  className="w-3  sm:w-5 sm:h-8"
                  disabled={item.quantity === 1}
                />
                <InputNumber
                  min={1}
                  max={item.productItemResponse.stock}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(value, item)}
                  className={`sm:w-14 w-10 h-8 text-sm text-center border  transition-all duration-500 ${
                    errorItemId === item.id
                      ? "border-red-500 animate-shake"
                      : "border-gray-300"
                  }`}
                />
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={() => handleQuantityChange(item.quantity + 1, item)}
                  className="w-2  sm:w-5 sm:h-8"
                  disabled = {item.quantity >=  item.productItemResponse.stock}
                  title={
                    item.quantity >= item.productItemResponse.stock
                      ? "Đã đạt số lượng tối đa"
                      : " "
                  }
                />
              </div>

              <div className=" w-2/12 sm:w-1/12 flex justify-center text-sm sm:text-base font-semibold text-red-500">
                {item.productItemResponse.discount ? (
                  <div className="flex flex-col justify-center">
                    <p className="">
                      {Number(
                        item.productItemResponse.price * item.quantity -
                          item.productItemResponse.discount * item.quantity
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                    <p className="text-gray-500 line-through text-sm font-normal">
                      {Number(
                        item.productItemResponse.price * item.quantity
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                  </div>
                ) : (
                  <p>
                    {" "}
                    {Number(
                      item.productItemResponse.price * item.quantity
                    ).toLocaleString("vi-VN")}
                    đ{" "}
                  </p>
                )}
              </div>

              <div
                onClick={() => handleDeleteCartItem(item.id)}
                className="w-1/12 flex justify-center text-xl sm:text-2xl ml-4 hover:text-red-500 cursor-pointer"
              >
                {!isCheckingOut ? <RiDeleteBin6Line /> : <></>}
              </div>
            </div>
            {item.quantity > item.productItemResponse.stock && (
                <p className="text-center text-red-500 mt-2 ">
                  Hiện tại hệ thống còn {item.productItemResponse.stock} sản
                  phẩm 
                </p>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
