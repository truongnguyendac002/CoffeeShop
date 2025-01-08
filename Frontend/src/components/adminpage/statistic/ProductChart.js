import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Select, Table } from "antd";
import moment from "moment";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";

const { Option } = Select;

const ProductChart = () => {
  const [view, setView] = useState("overview");
  const [data, setData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (view === "overview") {
          response = await fetchWithAuth(
            summaryApi.getTop5BestSellingProduct.url,
            {
              method: summaryApi.getTop5BestSellingProduct.method,
            }
          );
        } else {
          const startDate = moment()
            .year(selectedYear)
            .month(selectedMonth)
            .startOf("month")
            .format("YYYY-MM-DD");
          const endDate = moment()
            .year(selectedYear)
            .month(selectedMonth)
            .endOf("month")
            .format("YYYY-MM-DD");
          const url = `${summaryApi.getTop5MonthlySellingProduct.url}?startDate=${startDate}&endDate=${endDate}`;
          response = await fetchWithAuth(url, {
            method: summaryApi.getTop5MonthlySellingProduct.method,
          });
        }
        const result = await response.json();
        if (result.respCode === "000" && result.data.length > 0) {
          setData(result.data);
          setDetailedData(result.data);
        } else {
          setData([]);
          setDetailedData([]);
          console.warn("No data available for the selected month.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setData([]);
        setDetailedData([]);
      }
    };

    fetchData();
  }, [view, selectedMonth, selectedYear]);

  const handleViewChange = (value) => {
    setView(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const aggregatedColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "quantitySold",
      key: "quantitySold",
    },
  ];

  const detailedColumns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Phân loại",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "quantitySold",
      key: "quantitySold",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value),
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-2/3 flex items-center justify-between ">
        <p>Top 5 sản phẩm bán chạy nhất </p>
        <div className="space-x-4">
          <Select
            defaultValue="overview"
            onChange={handleViewChange}
            className="w-32 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
          >
            <Option value="overview">Tổng quan</Option>
            <Option value="monthly">Theo tháng</Option>
          </Select>
          {view === "monthly" && (
            <>
              <Select
                defaultValue={selectedMonth}
                onChange={handleMonthChange}
                className="w-24 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
              >
                {moment.months().map((month, index) => (
                  <Option key={index} value={index}>
                    {month}
                  </Option>
                ))}
              </Select>
              <Select
                defaultValue={selectedYear}
                onChange={handleYearChange}
                className="w-24 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => moment().year() - 5 + i
                ).map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </div>
      </div>
      <div className="flex space-x-8 mt-4">
        <BarChart width={800} height={350} data={data} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantitySold" name="Số lượng đã bán" fill="#82ca9d" />
        </BarChart>
        <Table
          dataSource={data}
          columns={aggregatedColumns}
          pagination={false}
          rowKey="productId"
          className="w-1/2"
        />
      </div>
      <Table
        dataSource={detailedData}
        columns={detailedColumns}
        pagination={{ pageSize: 5 }}
        rowKey="productId"
        className="w-full shadow-md rounded-lg"
      />
    </div>
  );
};

export default ProductChart;
