import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import App from '../App'
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import Cart from "../pages/Cart";
import OtpAuthentication from "../pages/OtpAuthentication";
import ChangePassword from "../pages/ChangePassword";
import PrivateRoute from "./private.route";
import Checkout from "../pages/Checkout";
import ProductDetail from "../pages/ProductDetail";
import Profile from "../pages/Profile";
import AdminHome from "../pages/AdminHome";
import ProductsContent from "../components/adminpage/product/ProductsContent";
import UsersContent from "../components/adminpage/user/UsersContent";
import NotFound from "../pages/NotFound404";
import SearchProduct from "../pages/SearchProduct";
import OrderStatus from "../components/cart/OrderStatus";
import CategoryPage from "../pages/CategoryPage";
import OrdersContent from "../components/adminpage/order/OrdersContent";
import ChatContent from "../components/adminpage/message/ChatContent";
import Statistics from "../components/adminpage/statistic/Statistics";
import OrderDetails from "../components/profile/OrderDetails";

import BrandsContent from "../components/adminpage/brand/BrandsContent";
import CategoryContent from "../components/adminpage/category/CategoryContent";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
             <ScrollRestoration />
             <App />
            </>
        ),
        children: [
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: "cart",
                        element: (
                            <PrivateRoute>
                                <Cart />
                            </PrivateRoute>
                        ),

                    },
                    {
                        path: "/product/:id",
                        element: <ProductDetail />
                    },
                    {
                        path: "checkout",
                        element: (
                            <PrivateRoute>
                                <Checkout />
                            </PrivateRoute>
                        ),

                    },
                    {
                        path: "/search", 
                        element: <SearchProduct/>
                    },
                    {
                        path: "profile",
                        element: (
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "/order-status",
                        element: (
                            <PrivateRoute>
                                <OrderStatus />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "*",
                        element: <NotFound />,

                    },
                    {
                        path: "/:categoryName/:categoryId",
                        element: <CategoryPage />
                    },
                    {
                        path: "/order-detail",
                        element: (
                            <PrivateRoute>
                                <OrderDetails  />
                            </PrivateRoute>
                        ),
                    },
                ]
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/sign-up",
                element: <SignUp />,
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />
            },
            {
                path: '/otp-auth',
                element: <OtpAuthentication />
            },
            {
                path: '/change-password',
                element: <ChangePassword />
            },
            {
                path: "/admin",
                element: (
                    <PrivateRoute>
                        <AdminHome />
                    </PrivateRoute>
                ),
                children: [
                    {
                        path: "",
                        element: <Statistics />,
                    },
                    {
                        path: "products",
                        element: (
                            <ProductsContent />
                        ),
                    },
                    {
                        path: "users",
                        element: (
                            <UsersContent />
                        ),
                    },
                    {
                        path: "orders",
                        element: <OrdersContent />
                    },
                    {
                        path: "messages",
                        element: <ChatContent />
                    },
                    {
                        path: "statistics",
                        element: <Statistics />,
                    },
                    {
                        path: "brands",
                        element: <BrandsContent />,
                    },
                    {
                        path: "categories",
                        element: <CategoryContent />,
                    },
                    {
                        path: "*",
                        element: <NotFound />,

                    }
                ]

            },


        ]

    }
]);

export default router;