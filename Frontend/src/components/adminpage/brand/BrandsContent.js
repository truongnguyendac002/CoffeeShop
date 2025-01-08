import React, { useEffect, useState } from 'react';
import BrandTable from './BrandsTable';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';

const BrandsContent = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchAllBrands = async () => {
            const response = await fetchWithAuth(summaryApi.getAllBrand.url, {
                method: summaryApi.allBrand.method,
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setBrands(data.data);
            } else {
                console.log("error fetchAllBrands data:", data);
            }
        };
        fetchAllBrands();
    }, []);

    return (
        <div>
            <BrandTable brands={brands} setBrands={setBrands} />
        </div>
    );
};

export default BrandsContent; 