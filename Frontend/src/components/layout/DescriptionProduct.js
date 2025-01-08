import React from "react";

const DescriptionProduct = ({ product }) => {
  return (
    <>
      <h2 className="text-xl font-bold lg:mt-6 mt-4 ">Chi tiết sản phẩm</h2>
      <div className="container mx-auto lg:mt-8 mt-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ul>
            <li className="flex justify-start border-b py-2">
              <span className="font-semibold md:w-1/4 w-1/3">Thương hiệu:</span>
              <span>{product.brand.name}</span>
            </li>
            <li className="flex justify-start border-b py-2">
              <span className="font-semibold md:w-1/4 w-1/3">Xuất xứ:</span>
              <span>Việt Nam </span>
            </li>
            <li className="flex justify-start border-b py-2">
              <span className="font-semibold md:w-1/4 w-1/3">
                Loại thực phẩm:
              </span>
              <span>Đồ uống </span>
            </li>
            <li className="flex justify-start border-b py-2">
              <span className="font-semibold md:w-1/4 w-1/3">Loại Cafe:</span>
              <span>{product.category.name}</span>
            </li>
            <li className="flex justify-start border-b py-2">
              <span className="font-semibold md:w-1/4 w-1/3">
                Mô tả sản phẩm:
              </span>
              <span>
                {" "}
                {product?.description
                  ? product.description
                  : "Không có mô tả sản phẩm"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DescriptionProduct;
