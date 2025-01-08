import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useCallback } from "react";
import fetchWithAuth from "./helps/fetchWithAuth";
import summaryApi from "./common";
import Context from "./context";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "./store/userSlice";
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch();
  // Để tránh việc fetch user details nhiều lần
  const user = useSelector((state) => state.user.user, (prev, next) => prev === next);
  const fetchUserDetails = useCallback(async () => {
    dispatch(setLoading(true));
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");

    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      // Thử lấy thông tin user
      const response = await fetchWithAuth(summaryApi.current_user.url, {
        method: summaryApi.current_user.method,
      });

      const dataResponse = await response.json();

      if (dataResponse.respCode === "000") {
        dispatch(setUser(dataResponse.data));
      } else if (dataResponse.respCode === "103") {
        // Token hết hạn, thử làm mới token
        const refreshResponse = await fetch(summaryApi.refreshToken.url, {
          method: summaryApi.refreshToken.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const refreshResult = await refreshResponse.json();

        if (refreshResult.respCode === "000") {
          // Lưu token mới vào Cookies
          Cookies.set("token", refreshResult.data.accessToken);
          Cookies.set("refreshToken", refreshResult.data.refreshToken);

          // Gọi lại fetchUserDetails để lấy thông tin user sau khi làm mới token
          const retryResponse = await fetchWithAuth(
            summaryApi.current_user.url,
            {
              method: summaryApi.current_user.method,
            }
          );

          const retryResult = await retryResponse.json();

          if (retryResult.respCode === "000") {
            dispatch(setUser(retryResult.data));
          } else {
            throw new Error(retryResult.respDesc);
          }
        } else {
          // Làm mới token thất bại, user phải đăng nhập lại
          throw new Error("Unable to refresh token, please log in again.");
        }
      } else {
        throw new Error(dataResponse.respDesc);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      toast.error("Failed to fetch user details");
    } finally {
      dispatch(setLoading(false)); // Đảm bảo loading chuyển thành false khi kết thúc
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, user]);

  useEffect(() => {
    document.title = 'Coffee Shop';
  }, []);


  return (
    <Context.Provider value={{ fetchUserDetails }}>
      <Outlet />
      <ToastContainer autoClose={2000} />
    </Context.Provider>
  );
}

export default App;
