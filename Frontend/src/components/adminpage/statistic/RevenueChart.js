import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Select, Table } from "antd";
import moment from "moment";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";

const { Option } = Select;

const RevenueChart = () => {
  const [view, setView] = useState("overview");
  const [data, setData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(summaryApi.getOrderByStatus.url + `Completed`, {
          method: summaryApi.getOrderByStatus.method,
        });
        const result = await response.json();
        if (result.respCode === "000") {
          const orders = result.data;
          setAllOrders(orders);
          updateData(view, orders, selectedMonth, selectedYear);
        } else {
          setData([]);
          setDetailedData([]);
          console.warn("No data available for the selected period.");
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setData([]);
        setDetailedData([]);
      }
    };

    fetchData();
  }, [view, selectedMonth, selectedYear]);

  const updateData = (view, orders, month, year) => {
    if (view === "overview") {
      setData(aggregateMonthlyData(orders));
      setDetailedData(orders);
    } else {
      setData(aggregateDailyData(orders, month, year));
      setDetailedData(filterOrdersByMonth(orders, month, year));
    }
  };

  const aggregateMonthlyData = (orders) => {
    const monthlyData = {};
    orders.forEach(order => {
      const month = moment(order.orderDate).format('YYYY-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = { month, totalRevenue: 0 };
      }
      monthlyData[month].totalRevenue += order.total;
    });
    return Object.values(monthlyData);
  };

  const aggregateDailyData = (orders, month, year) => {
    const dailyData = {};
    orders.forEach(order => {
      const orderDate = moment(order.orderDate);
      if (orderDate.month() === month && orderDate.year() === year) {
        const day = orderDate.format('YYYY-MM-DD');
        if (!dailyData[day]) {
          dailyData[day] = { day, totalRevenue: 0 };
        }
        dailyData[day].totalRevenue += order.total;
      }
    });
    return Object.values(dailyData);
  };

  const aggregateMonthlyTotal = (orders, month, year) => {
    const totalRevenue = orders.reduce((acc, order) => {
      const orderDate = moment(order.orderDate);
      if (orderDate.month() === month && orderDate.year() === year) {
        return acc + order.total;
      }
      return acc;
    }, 0);
    return [{ month: moment().year(year).month(month).format('YYYY-MM'), totalRevenue }];
  };

  const filterOrdersByMonth = (orders, month, year) => {
    return orders.filter(order => {
      const orderDate = moment(order.orderDate);
      return orderDate.month() === month && orderDate.year() === year;
    });
  };

  const handleViewChange = (value) => {
    setView(value);
    updateData(value, allOrders, selectedMonth, selectedYear);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    if (view === "monthly") {
      setData(aggregateDailyData(allOrders, value, selectedYear));
      setDetailedData(filterOrdersByMonth(allOrders, value, selectedYear));
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    if (view === "monthly") {
      setData(aggregateDailyData(allOrders, selectedMonth, value));
      setDetailedData(filterOrdersByMonth(allOrders, selectedMonth, value));
    }
  };

  const handleRowClick = (record) => {
    if (view === "overview") {
      const selectedMonthOrders = filterOrdersByMonth(allOrders, moment(record.month).month(), moment(record.month).year());
      setDetailedData(selectedMonthOrders);
    }
  };

  const aggregatedColumns = [
    {
      title: "Thời gian",
      dataIndex: view === "overview" ? "month" : "day",
      key: "time",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
  ];

  const detailedColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thông tin đặt hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (address) => {
        const { receiverName, receiverPhone, location } = address || {};
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {receiverName && `Tên: ${receiverName}\n`}
            {receiverPhone && `SĐT: ${receiverPhone}\n`}
            {location && `Địa chỉ: ${location}`}
          </div>
        );
      },
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-4">
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
              {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </>
        )}
      </div>
      <div className="flex space-x-8 mt-4">
          <LineChart
            width={800}
            height={350}
            data={data}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={view === "overview" ? "month" : "day"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalRevenue" name="Doanh thu" stroke="#82ca9d" />
          </LineChart>
          <Table
            dataSource={view === "overview" ? data : aggregateMonthlyTotal(allOrders, selectedMonth, selectedYear)}
            columns={aggregatedColumns}
            pagination={false}
            rowKey={view === "overview" ? "month" : "day"}
            className="w-1/2"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
      </div>
      <Table
        dataSource={detailedData}
        columns={detailedColumns}
        pagination={{ pageSize: 5 }}
        rowKey="orderId"
        className="w-full shadow-md rounded-lg"
      />
    </div>
  );
};

export default RevenueChart;
