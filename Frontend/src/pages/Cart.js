import React from "react";
import CartSummary from "../components/cart/CartSummary";
import CartItems from "../components/cart/CartItems";
import { useSelector } from 'react-redux';
import cartEmpty from "../assets/img/cart-empty.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Cart() {
 
  const cartItems = useSelector((store) => store.cart.items);
  const navigate = useNavigate();
  const handleReturnHome = ( ) => {
    navigate("/");
  }

  return (
    <>
    {
       cartItems.length > 0  ? (
        <div className="container mx-auto  bg-gray-100 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full lg:w-[70%]">
            <CartItems cartItems={cartItems}  />
          </div>
          <div className="w-full lg:w-[30%]">
            <CartSummary  />
          </div>
        </div>
      </div>
       ) : (
        <div className="container mx-auto shadow-lg w-[40%] relative">
          <img
            src={cartEmpty}
            alt="Cart Empty"
            className="overflow-hidden object-cover rounded"
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleReturnHome}
              className="flex items-center p-2 text-white uppercase rounded-lg shadow-lg
                        bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 transition-all 
                        duration-500 ease-in-out bg-[length:200%_auto] hover:bg-[position:right_center]"
            >
            <FaArrowLeftLong className="mr-3"/>
              Quay lại mua hàng
            </button>
          </div>
        </div>
       )
    }
      
    </>
  );
}

export default Cart;
