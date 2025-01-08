import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { Table, Select } from "antd";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";
import moment from "moment";

const { Option } = Select;
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#0088FE"];

const UserChart = () => {
  const [data, setData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("overview"); // "overview" or "monthly"
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // Default current month
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Default current year

  useEffect(() => {
    if (timeFrame === "overview") {
      fetchOverviewData();
    } else {
      fetchMonthlyData(selectedMonth, selectedYear);
    }
  }, [timeFrame, selectedMonth, selectedYear]);

  const fetchOverviewData = async () => {
    try {
      const response = await fetchWithAuth(summaryApi.getUsersStatistic.url);
      const result = await response.json();
      if (result.respCode === "000") {
        const processedData = result.data.map(user => ({
          userId: user.userId || "Chưa cập nhật",
          userName: user.userName || "Chưa cập nhật",
          email: user.email || "Chưa cập nhật",
          creatAt: user.creatAt || "Chưa cập nhật",
          totalSold: user.totalSold || 0,
        }));
        setData(processedData);
        setDetailedData(processedData);
      } else {
        console.error("Failed to fetch overview data");
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  const fetchMonthlyData = async (month, year) => {
    try {
      const response = await fetchWithAuth(`${summaryApi.getTop5MonthlyUsers.url}?month=${month}&year=${year}`);
      const result = await response.json();
      if (result.respCode === "000") {
        const processedData = result.data.map(user => ({
          userId: user.userId || "Chưa cập nhật",
          userName: user.userName || "Chưa cập nhật",
          email: user.email || "Chưa cập nhật",
          creatAt: user.creatAt || "Chưa cập nhật",
          totalSold: user.totalSold || 0,
        }));
        setData(processedData);
        setDetailedData(processedData);
      } else {
        console.error("Failed to fetch monthly data");
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      setDetailedData([clickedData]);
    }
  };

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const detailedColumns = [
    {
      title: "Mã khách hàng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày tạo tài khoản",
      dataIndex: "creatAt",
      key: "creatAt",
    },
    {
      title: "Tổng đã mua",
      dataIndex: "totalSold",
      key: "totalSold",
      render: (value) => formatCurrency(value),
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-2 items-center">
        <Select
          defaultValue={timeFrame}
          style={{ width: 150 }}
          onChange={handleTimeFrameChange}
        >
          <Option value="overview">Tổng quan</Option>
          <Option value="monthly">Theo Tháng</Option>
        </Select>
        {timeFrame === "monthly" && (
          <>
            <Select
              defaultValue={selectedMonth}
              style={{ width: 120 }}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <Option key={index + 1} value={index + 1}>
                  Tháng {index + 1}
                </Option>
              ))}
            </Select>
            <Select
              defaultValue={selectedYear}
              style={{ width: 120 }}
              onChange={handleYearChange}
            >
              {Array.from({ length: 5 }, (_, index) => {
                const year = moment().year() - index;
                return (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                );
              })}
            </Select>
          </>
        )}
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        <PieChart width={600} height={400} onClick={handleChartClick} className="w-full mb-6">
          <Pie
            data={data}
            dataKey="totalSold"
            nameKey="email"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>

        <Table
          dataSource={detailedData}
          columns={detailedColumns}
          pagination={{ pageSize: 5 }}
          rowKey="userId"
          className="w-full shadow-md rounded-lg"
        />
      </div>
    </div>
  );
};

export default UserChart;
