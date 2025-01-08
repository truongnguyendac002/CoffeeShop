import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../layout/ProductCard";
import { useRef } from "react";
import { Pagination } from "antd";

const ListProduct = ({ products: initialProducts, title }) => {
  const titleRef = useRef();
  const [products, setProducts] = useState(initialProducts || []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const productList = products;

  const currentProducts = useMemo(() => {
    const indexLast = currentPage * itemsPerPage;
    const indexFirst = indexLast - itemsPerPage;
    return productList.slice(indexFirst, indexLast);
  }, [currentPage, itemsPerPage, productList]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page); 
    if(titleRef.current) {
      const elementPosition = titleRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - 150, 
        behavior: "smooth",
      });
    }
  } 

  return (
    <div className="container bg-white shadow-md p-3 mx-auto mt-10 ">
      {title && (
        <div>
          <h2 ref={titleRef} className="font-bold text-base ">
            {`${title} ( ${productList.length} )`}
          </h2>
        </div>
      )}
      {productList.length === 0 ? (
        <div className="text-center text-lg font-bold text-gray-500 mt-5">
          No results found
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:gap-6 md:gap-3 gap-2 mt-5 ">
          {currentProducts.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={productList.length}
          onChange={ handlePageChange}
          pageSize={itemsPerPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ListProduct;
