import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Table,
  Modal,
  Button,
  Rate,
  Input,
  message,
  Tag,
} from "antd";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common";
import image1 from "../../assets/img/empty.jpg";

const OrderDetails = ({ orderId, onClose }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const resp = await fetchWithAuth(
          `${summaryApi.getOrderDetails.url}/${orderId}`,
          { method: "GET" }
        );
        const data = await resp.json();
        if (data.respCode === "000") {
          setOrderDetail(data.data);
        } else {
          console.error("Failed to fetch order details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);


  const handleRateProduct = (record) => {
    setCurrentProduct(record);
    setRating(0);
    setComment("");
    setIsReviewModalVisible(true);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      message.error("Please provide a rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuth(summaryApi.addReview.url, {
        method: summaryApi.addReview.method,
        body: JSON.stringify({
          OrderItemId: currentProduct.orderItemId,
          Rating: rating,
          Comment: comment,
        }),
      });
      const data = await response.json();
      if (data.respCode === "000") {
        message.success("Review submitted successfully");

        setOrderDetail((prevOrderDetail) => {
          const updatedOrderItems = prevOrderDetail.orderItems.map((item) =>
            item.orderItemId === currentProduct.orderItemId
              ? { ...item, isReviewed: true } // Cập nhật isReviewed thành true
              : item
          );
          return { ...prevOrderDetail, orderItems: updatedOrderItems };
        });

        setIsReviewModalVisible(false);
      } else {
        message.error("Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("There was an error submitting your review.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (url) => (
        <img
          src={url || image1}
          alt="Product"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Type",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Review",
      key: "review",
      render: (_, record) =>
        orderDetail.orderStatus === "Completed" ? (
          record.isReviewed ? (
            <Tag color="green" className="px-3 py-1">
              Reviewed
            </Tag>
          ) : (
            <Button type="primary" onClick={() => handleRateProduct(record)}>
              Review Product
            </Button>
          )
        ) : (
          <Tag color="gray" className="px-3 py-1">
            Not Available
          </Tag>
        ),
    },
  ];

  return (
    <Modal
      title="Order Detail"
      open={!!orderId}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width="60%" 
      centered
      confirmLoading={loading}
      className="max-w-full"
    >
      {loading ? (
        <p>Loading...</p>
      ) : orderDetail ? (
        <>
          <Descriptions
            bordered
            column={1}
            style={{ fontSize: "14px", padding: "4px" }} 
          >
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Order ID</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.orderId}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Status</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.orderStatus}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Customer Name</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.shippingAddress.receiverName}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Phone Number</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.shippingAddress.receiverPhone}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Shipping Addr</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.shippingAddress.location}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Shipping Fee</span>}
              style={{ padding: "8px" }}
            >
              {"10000 đ"}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ fontWeight: "bold" }}>Total Amount</span>}
              style={{ padding: "8px" }}
            >
              {orderDetail.total} đ
            </Descriptions.Item>
          </Descriptions>

          <h3 className="mt-4 mb-2 text-lg font-semibold">List Order Items:</h3>
          <Table
            dataSource={orderDetail.orderItems.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            columns={columns}
            rowKey="key"
            pagination={false}
            scroll={{ x: 600 }} 
            style={{ width: "100%" }} 
            className="overflow-x-auto"
          />
        </>
      ) : (
        <p>No order details available.</p>
      )}

      <Modal
        title="Rate Product"
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsReviewModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitReview}
            loading={loading}
          >
            Submit Review
          </Button>,
        ]}
        width="60%" // Giảm độ rộng modal trên thiết bị di động
        centered
      >
        <div>
          <h4 className="text-lg">Rating</h4>
          <Rate value={rating} onChange={handleRatingChange} />

          <h4 className="text-lg mt-4">Comment</h4>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
          />
        </div>
      </Modal>
    </Modal>
  );
};

export default OrderDetails;
