import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Slideshow from "../components/homepage/Slideshow";
import ListCategory from "../components/homepage/ListCategory";
import ListProduct from "../components/homepage/ListProduct";
import { useDispatch, useSelector } from "react-redux";
import fetchWithAuth from "../helps/fetchWithAuth";
import summaryApi from "../common";
import Cookies from "js-cookie";
import BreadcrumbNav from "../components/layout/BreadcrumbNav";
import { setCartItems } from "../store/cartSlice";
import { selectFavorites, addToFavorites } from "../store/favoritesSlice ";
import ChatWidget from "../components/layout/ChatWidget";

const Home = () => {
  const location = useLocation();
  const user = useSelector(
    (state) => state.user.user,
    (prev, next) => prev === next
  );
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const favorites = useSelector(selectFavorites);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsCartLoading(true);
      try {
        const response = await fetchWithAuth(
          summaryApi.getAllCartItems.url + user.id,
          { method: summaryApi.getAllCartItems.method }
        );
        const dataResponse = await response.json();

        if (dataResponse.data) {
          dispatch(setCartItems(dataResponse.data));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsCartLoading(false);
      }
    };

    if (user) {
      if (!Cookies.get("cart-item-list") && cartItems.length === 0) {
        fetchCartItems();
      }
    }
  }, [user, dispatch, cartItems.length]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetchWithAuth(
          summaryApi.allFavorites.url + user.id,
          {
            method: summaryApi.allFavorites.method,
          }
        );

        const dataResponse = await response.json();

        if (dataResponse.data) {
          if (dataResponse.data.length > 0) {
            for (const favoriteProduct of dataResponse.data) {
              dispatch(addToFavorites(favoriteProduct.product));
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    if (user) {
      if (!localStorage.getItem("favorites") && favorites.length === 0) {
        fetchFavorites();
      }
    }
  }, [user, dispatch, favorites.length]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsProductsLoading(true);
        const productResponse = await fetch(summaryApi.allProduct.url, {
          method: summaryApi.allProduct.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const productResult = await productResponse.json();

        if (productResult.respCode === "000") {
          setProducts(productResult.data);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsProductsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsCategoriesLoading(true);
      try {
        const categoryResponse = await fetch(summaryApi.allCategory.url, {
          method: summaryApi.allCategory.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const dataResult = await categoryResponse.json();
        if (dataResult.respCode === "000") {
          setCategories(dataResult.data);
        }
      } catch (error) {
        console.log("error", error);
      }finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategory();
  }, []);

  if (user?.roleName === "ROLE_ADMIN") {
    navigate("/admin");
  } else if (isCartLoading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
      <>
        <Header />
        <div className="flex justify-center h-screen mt-3">
          <Spin indicator={antIcon} />
        </div>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="mt-32"></div>
        {location.pathname !== "/profile" && <BreadcrumbNav />}
        <main className="container mx-auto ">
          {location.pathname === "/" && (
            <>
              <Slideshow />
              <div className="flex flex-col md:flex-row mt-5">
                <div className="md:w-2/6 lg:w-1/5 w-full md:pr-4">
                  <div className="sticky top-24">
                    {isCategoriesLoading ? (
                    <div className="flex justify-center items-center h-screen">
                      <LoadingOutlined
                        style={{ fontSize: 48, color: "red" }}
                        spin
                      />
                    </div>
                  ) : (
                    <ListCategory  categories={categories}/>
                  )}
                  </div>
                </div>
                <div className="md:w-4/6 lg:w-4/5 w-full md:pl-4">
                  {isProductsLoading ? (
                    <div className="flex justify-center items-center h-screen">
                      <LoadingOutlined
                        style={{ fontSize: 48, color: "red" }}
                        spin
                      />
                    </div>
                  ) : (
                    <ListProduct products={products} title={"All products"} />
                  )}
                </div>
              </div>
            </>
          )}
          <section className=" mb-8">
            <Outlet />
            <ChatWidget />
          </section>
        </main>
        <Footer />
      </>
    );
  }
};

export default Home;
