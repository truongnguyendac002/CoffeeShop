import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";

import { MdOutlineShoppingCart } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../store/userSlice";
import Cookies from "js-cookie";
import { message } from "antd";
import { Badge } from "antd";
import { clearCart } from "../../store/cartSlice";
import { clearFavorites } from "../../store/favoritesSlice ";
import CartTab from "../cart/CartTab";
import { clearAddress } from "../../store/shippingAddressSlice ";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const carts = useSelector((store) => store.cart.items);

  const loading = useSelector((state) => state.user.loading);
  const [totalQuantity, setTotalQuantity] = useState(0);


  const [showCartTab, setShowCartTab] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("cart-item-list");
    localStorage.removeItem("shipping-address");
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearFavorites());
    dispatch(clearAddress());
    navigate("/");
    message.success("Logout Successfully!");
  };


  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm) {
      const query = encodeURIComponent(searchTerm);
      navigate(`/search?q=${query}`);
      setSearchTerm("");
    } else {
      navigate("/search");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const total = carts.length;
    setTotalQuantity(total);
  }, [carts, user]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <header className="bg-gray-150 dark:bg-gray-900 px-10 py-7 fixed top-0 w-full z-20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-32">
          {/* logo  */}
          <div className="">
            <Link to="/">
              <Logo />
            </Link>
          </div>


        </div>
        {/* search */}
        <div className="bg-white hidden w-full max-w-xs lg:flex items-center justify-between rounded-full border pl-2 focus-within:shadow">
          <input
            type="text"
            placeholder="Search product here..."
            className="w-full outline-none px-4 font-medium "
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div
            onClick={handleSearch}
            className="flex h-8 min-w-[50px] items-center justify-center rounded-r-full cursor-pointer 
            text-white text-lg  bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 transition-all 
            duration-500 ease-in-out bg-[length:200%_auto] hover:bg-[position:right_center]"
          >
            <GrSearch />
          </div>
        </div>

        {/* user */}
        <div className="flex items-center space-x-6">
          <div
            className="flex items-center space-x-6 relative"
            onMouseEnter={() => setShowCartTab(true)}
            onMouseLeave={() => setShowCartTab(false)}
          >
            <Link to="/cart">
              <div className="relative cursor-pointer text-4xl">
                <Badge count={totalQuantity} size="large" showZero>
                  <MdOutlineShoppingCart style={{ fontSize: "30px" }} />
                </Badge>
              </div>
            </Link>

            {showCartTab && (
              <div className="absolute top-12 -right-4 z-50 hidden md:block">
                <CartTab items={carts} />
              </div>
            )}
          </div>

          {user?.id && (
            <>
              <Link to="/profile">
                <div className="relative flex cursor-pointer justify-center text-4xl">
                  {user?.profile_img ? (
                    <img
                      src={user?.profile_img}
                      alt="Avatar User"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <PiUserCircle />
                  )}
                </div>
              </Link>
            </>
          )}
          {!user?.id ? (
            <>
              <div>
                <Link to="/login">
                  <button className="rounded-full px-5 py-1 text-white text-lg shadow-lg
                  bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 transition-all duration-500 
                  ease-in-out bg-[length:200%_auto] hover:bg-[position:right_center]">
                    Sign In
                  </button>
                </Link>
              </div>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
