import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const InPutForm = ({
  label,
  type = "text",
  placeholder = "",
  name,
  value,
  onChange,
  onBlur,
  error = "",
  required = false,
  showEye = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col space-y-1">
      {label && (
        <label className="mb-1 text-sm font-semibold text-gray-700 ">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                ${
                  error
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300"
                }`}
        />
        {showEye && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3  top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center mt-1 space-x-1 text-sm text-red-600">
          <div>
            <IoIosArrowForward />
          </div>
          {error}
        </div>
      )}
    </div>
  );
};

export default InPutForm;
