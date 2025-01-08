import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="min-h-80 bg-white rounded border p-3 overflow-hidden shadow-lg">
      <div className="border-b cursor-pointer" onClick={handleCardClick}>
        {product?.images?.[0]?.url ? (
          <div className="relative w-full h-36 md:h-40">
            {!isImageLoaded && (
              <div className="absolute inset-0  flex items-center justify-center">
                <LoadingOutlined className="text-3xl text-gray-400" spin />
              </div>
            )}
            <img
              className={`w-full rounded object-cover h-36 md:h-40 transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={product.images[0].url}
              alt={product.name || "Product Image"}
              onLoad={handleImageLoad}
            />
          </div>
        ) : (
          <div className="w-full rounded bg-gray-200 flex items-center justify-center h-36 md:h-40">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="font-medium text-lg line-clamp-1 ">{product.name}</div>
        <p className="text-gray-400 font-normal mt-1">{product.brand.name}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-medium text-red-500 mt-1">
            {Number(product.minPrice).toLocaleString("vi-VN")}đ
          </span>

          <span className="flex items-center">
            {product?.rating !== 0.0 ? product?.rating?.toFixed(1) : ""}
            <FaStar className="text-yellow-500 mx-1" />
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div
            className="py-2 px-7 w-full text-center bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={handleCardClick}
          >
            <button>Xem chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
