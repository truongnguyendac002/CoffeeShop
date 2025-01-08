import React, { useEffect, useState } from "react";
import summaryApi from "../../common";
import { Slider, Box, Typography } from "@mui/material";

const Filter = ({ onFilter, products ,onClickFilter }) => {
  const min = 0 ;
  const max = 5000000;
  const step= 50000;
  const [brands, setBrands] = useState([]);
  const [selectBrand, setSelectBrand] = useState([]);
  const [value, setValue] = useState([min, max]);

  const handleChange = (event, newValue) => { 
    setValue(newValue);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(summaryApi.allBrand.url, {
          method: summaryApi.allBrand.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const dataResponse = await response.json();
        if (dataResponse.respCode === "000") {
          setBrands(dataResponse.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchBrands();
  }, []);

  const handleSelectBrand = (brand) => {
    setSelectBrand((pre) => 
      pre.includes(brand.name ) 
      ? pre.filter((item) => item !== brand.name) 
      : [...pre , brand.name]
    );
  };

  const handleClickFilter = () => {
    const filtered = products.filter((product) => {
      const inPriceRange =
        product.minPrice >= value[0] && product.minPrice <= value[1];
      const matchesBrand = selectBrand.length
        ? selectBrand.includes(product.brand.name)
        : true  ;
      return inPriceRange && matchesBrand;
    });
    onClickFilter();
    onFilter(filtered);
  };

  return (
    <div className="relative p-6 w-full bg-white rounded-lg shadow-xl ">
      <div className="w-full grid grid-cols-1 justify-between items-start gap-y-8">
        <div>
          <Box margin="0 auto">
            <Typography
              gutterBottom
              sx={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Price
            </Typography>
            <Slider
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={step}
              min={min}
              max={max}
              disableSwap
              // marks={marks}
              sx={{
                width: "100%",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  backgroundColor: "#02AAB0", 
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px rgba(2, 170, 176, 0.16)", 
                  },
                },
                "& .MuiSlider-track": {
                  height: 6,
                  backgroundColor: "#00CDAC",
                },
                "& .MuiSlider-rail": {
                  height: 6,
                  backgroundColor: "#ccc",
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#02AAB0", 
                },
              }}
            />

            <div className="grid grid-cols-2 gap-6 justify-between ">
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {value[0]}
              </Box>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {value[1]}
              </Box>
            </div>
          </Box>
        </div>

        {/* Lọc theo thương hiệu */}
        <div className="">
          <p className="text-xl font-semibold mb-4">Brand</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {brands.map((brand, index) => (
              <button
                key={index}
                className={`border rounded p-2 text-nowrap text-sm line-clamp-1 ${
                  selectBrand.includes(brand.name) ? "bg-yellow-500 text-white" : ""
                }`}
                onClick={() => handleSelectBrand(brand)}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className=" mt-10">
        <button
          onClick={handleClickFilter}
        
          className ="w-full p-2 text-white uppercase rounded-lg shadow-lg
           bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 transition-all 
           duration-500 ease-in-out bg-[length:200%_auto] hover:bg-[position:right_center]"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default Filter;
