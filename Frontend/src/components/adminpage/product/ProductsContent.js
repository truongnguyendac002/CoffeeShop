import { useEffect } from "react";
import ProductTable from "./ProductTable";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";
import { useState } from "react";

const ProductsContent = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    useEffect (() => {
        const fetchAllProducts = async () => {
            const response = await fetchWithAuth(
                summaryApi.allProduct.url,
                {
                    method: summaryApi.allProduct.method,
                }
            );
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setProducts(data.data);
            }
            else {
                console.log(data);
            }
        }
        const fetchAllCategories = async () => {
            const response = await fetchWithAuth(
                summaryApi.allCategory.url,
                {
                    method: summaryApi.allCategory.method,
                }
            );
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setCategories(data.data);
            }
            else {
                console.log(data);
            }
        }
        const fetchAllBrands = async () => {
            const response = await fetchWithAuth(
                summaryApi.allBrand.url,
                {
                    method: summaryApi.allBrand.method,
                }
            );
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setBrands(data.data);
            }
            else {
                console.log(data);
            }
        }
        fetchAllProducts();
        fetchAllCategories();
        fetchAllBrands();
    }, []);
    return (
        <>
            <ProductTable products={products} setProducts={setProducts}
            categories={categories} setCategories={setCategories}
            brands={brands} setBrands={setBrands} />
        </>
    );
}
export default ProductsContent;