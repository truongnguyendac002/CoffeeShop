import { Modal, Rate, Avatar, List, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';
import { Select, Popconfirm } from 'antd';

const ReviewModal = ({ visible, onClose, product }) => {
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [filteredReviews, setFilteredReviews] = useState([]);

    const pageSize = 3;

    useEffect(() => {
        const fetchReviewList = async () => {
            setLoading(true);
            try {
                const request = await fetchWithAuth(
                    summaryApi.getReviewByProductId.url + product.id,
                    {
                        method: summaryApi.getReviewByProductId.method,
                    }
                );
                const response = await request.json();
                if (response.respCode === "000") {
                    setReviewList(response.data);
                    setFilteredReviews(response.data); // Initialize filtered reviews
                } else {
                    console.error("Error fetching review list:", response);
                }
            } catch (error) {
                console.error("Error fetching review list:", error);
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchReviewList();
        }
    }, [product, visible]);

    const handleDeleteReview = async (reviewId) => {
        try {
            const request = await fetchWithAuth(
                summaryApi.deleteReview.url + reviewId,
                { method: summaryApi.deleteReview.method }
            );
            const response = await request.json();
            if (response.respCode === "000") {
                message.success("Review deleted successfully.");
                setReviewList((prev) => prev.filter((review) => review.id !== reviewId));
                setFilteredReviews((prev) => prev.filter((review) => review.id !== reviewId));
            } else {
                message.error("Failed to delete review.");
                console.error("Error deleting review:", response);
            }
        } catch (error) {
            message.error("Error deleting review.");
            console.error("Error:", error);
        }
    };

    const handleRatingFilterChange = (value) => {
        setRatingFilter(value);
        if (value === null) {
            setFilteredReviews(reviewList);
        } else {
            setFilteredReviews(reviewList.filter((review) => review.rating === value));
        }
        setCurrentPage(1); // Reset to first page after filter change
    };


    return (
        <Modal
            title={`Reviews for ${product?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <div className="mb-4 flex justify-end">
                <Select
                    className="w-20"
                    value={ratingFilter}
                    onChange={handleRatingFilterChange}
                    placeholder="Filter by rating"
                >
                    <Select.Option value={null}>Tất cả</Select.Option>
                    <Select.Option value={1}>1 Sao</Select.Option>
                    <Select.Option value={2}>2 Sao</Select.Option>
                    <Select.Option value={3}>3 Sao</Select.Option>
                    <Select.Option value={4}>4 Sao</Select.Option>
                    <Select.Option value={5}>5 Sao</Select.Option>
                </Select>
            </div>

            <List
                itemLayout="horizontal"
                dataSource={filteredReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                renderItem={(review) => (
                    <List.Item
                        className="border-b border-gray-200 pb-4"
                        actions={[
                            <Popconfirm
                                title="Sure to delete this review ?"
                                onConfirm={() => handleDeleteReview(review.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                >
                                    Delete
                                </Button>,
                            </Popconfirm>

                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={review.userAvatar || undefined}
                                    alt={review.userEmail}
                                    className="bg-gray-200"
                                >
                                    {review.userAvatar ? null : review.userEmail?.charAt(0)}
                                </Avatar>
                            }
                            title={
                                <Rate
                                    disabled
                                    value={review.rating}
                                    className="text-yellow-500"
                                />
                            }
                            description={
                                <>

                                    <div className="flex text-blue-400 items-center justify-between">
                                        <span className="font-medium text-sm">
                                            {review.userEmail || "Anonymous"}
                                        </span>

                                    </div>
                                    <p className="text-base text-gray-600">
                                        {review.comment || "No comment provided."}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {review.createAt}
                                    </p>
                                </>
                            }
                        />
                    </List.Item>
                )}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: filteredReviews.length,
                    onChange: (page) => setCurrentPage(page),
                }}
                loading={loading}
            />
        </Modal>
    );
};

export default ReviewModal;
