import React, { useState } from "react";
import PasswordInput from "../components/validateInputForm/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { VscLock } from "react-icons/vsc";
import { toast } from "react-toastify";
import summaryApi from "../common";

import {  useDispatch, useSelector } from "react-redux";
import { clearEmail } from "../store/forgotPasswordSlice";

function ChangePassword() {

  const email = useSelector((state) => state.forgotPassword.email);
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const [error ,setError] = useState(false);
  
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    repeatPassword: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setError(false);

    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (data.password === data.repeatPassword) {
      try {
        setError(false);
        const changePasswordResponse = await fetch(
          summaryApi.changePassword.url + email,
          {
            method: summaryApi.changePassword.method,
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const changePassResult = await changePasswordResponse.json();

        if (changePassResult.respCode === "000") {
          toast.success(changePassResult.data);
          dispatch(clearEmail());
          navigate("/login");
        }
      } catch (error) {
        toast.error(error);
        console.log("Error", error);
      }
    }else {
      setError("Confirm Password không đúng");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center">
          <div className="p-5 bg-gray-150 rounded-xl ">
            <VscLock />
          </div>
          <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
          <p className="mb-8 text-center w-full max-w-[80%] text-gray-400 ">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            label={"Password"}
            placeholder={"Enter password"}
            name={"password"}
            onChange={handleOnchange}
            setErrors={setPasswordError}
          />

          <PasswordInput
            label={"Confirm Password"}
            placeholder={"Enter confirmPassword"}
            name={"repeatPassword"}
            onChange={handleOnchange}
            setErrors={setPasswordError}

          />
          {
            error && (
              <p className="text-sm text-red-500 my-2">{error}</p>
            )
          }

          <ul className="mb-6 text-sm text-gray-500 list-disc list-inside">
            <li className="marker:text-red-500 ">
            Mật khẩu phải có ít nhất 8 ký tự 
            </li>
            <li className="marker:text-red-500 ">
            1 ký tự đặc biệt
            </li>
          </ul>

          <button
            type="submit"
            className={`w-full py-2 px-4  text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${ passwordError 
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-500 "
            }`}
            disabled={passwordError}
          >
            Reset password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login">
            <p className="text-indigo-600 hover:underline mt-2">
              ← Back to log in
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
