import React, { useState } from "react";
import { Table, Modal, Button, message } from "antd";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useDeleteReviewMutation, useGetAllReviewQuery } from "../../redux/features/reviews/reviews";
import { imageBaseUrl } from "../../config/imageBaseUrl";
import moment from "moment";

const ReviewsAll = () => {
    const { data: alldata, isLoading, isError } = useGetAllReviewQuery();
    const data = alldata?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const handleView = (record) => {
        setSelectedReview(record);
        setIsModalOpen(true);
    };

    const [deleteReview] = useDeleteReviewMutation();

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Are you sure you want to delete this review?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    const res = await deleteReview({ id: record?._id });
                    if (res?.data?.status) {
                        message.success("Review deleted successfully!");
                    } else {
                        message.error("Failed to delete. Try again.");
                    }
                } catch (error) {
                    message.error("Failed to delete. Try again.");
                }
            },
        });
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text) => <img src={imageBaseUrl + text} alt="review" style={{ width: 100 }} />,
        },
        { title: "Bonus Title", dataIndex: "bonusTitle", key: "bonusTitle" },
        { title: "Free Spins", dataIndex: "freeSpinsBonus", key: "freeSpinsBonus" },
        { title: "Admin Rating", dataIndex: "adminAvgRating", key: "adminAvgRating" },
        { title: "User Rating", dataIndex: "userAvgRating", key: "userAvgRating" },
        { title: "Summary", dataIndex: "summaryTitle", key: "summaryTitle" },
        {
            title: "Last Update",
            dataIndex: "lastUpdateDate",
            key: "lastUpdateDate",
            render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-5 items-center text-base">
                    <button className="text-[#704AAA]" onClick={() => handleView(record)}>
                        <IoEyeOutline className="size-6" />
                    </button>
                    <button className="text-[#704AAA]" onClick={() => handleDelete(record)}>
                        <MdDeleteForever className="size-6" />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <p>Loading reviews...</p>;
    if (isError) return <p>Error fetching reviews</p>;

    return (
        <div className="p-4">
            <div className="flex justify-end items-center mb-4">
                <Link
                    to={"/reviews-all/add-review"}
                    className="bg-[#704AAA] text-white rounded-lg px-8 py-2"
                >
                    Add Review
                </Link>
            </div>

            <Table columns={columns} dataSource={data} rowKey="_id" />

            <Modal
                open={isModalOpen}
                title="Review Details"
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>,
                ]}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                {selectedReview && (
                    <div className="space-y-4">
                        <div>
                            <strong>Image:</strong>
                            <img
                                src={imageBaseUrl + selectedReview.image}
                                alt="review"
                                style={{ width: 100, marginLeft: 10 }}
                            />
                        </div>
                        <div><strong>Bonus Title:</strong> {selectedReview.bonusTitle}</div>
                        <div><strong>Free Spins Bonus:</strong> {selectedReview.freeSpinsBonus}</div>
                        <div><strong>Admin Avg Rating:</strong> {selectedReview.adminAvgRating}</div>
                        <div><strong>User Avg Rating:</strong> {selectedReview.userAvgRating}</div>
                        <div><strong>Summary Title:</strong> {selectedReview.summaryTitle}</div>
                        <div><strong>Last Update:</strong> {selectedReview.lastUpdateDate}</div>

                        <div>
                            <strong>All Info:</strong>
                            <ul className="list-disc ml-6">
                                {selectedReview.allInfo?.map((info, i) => (
                                    <li key={i}>
                                        <strong>{info.title}:</strong> {info.subTitle}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <strong>Positive Side:</strong>
                            <ul className="list-disc ml-6">
                                {selectedReview.positivesSides?.map((p, i) => (
                                    <li key={i}>{p}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <strong>Negative Side:</strong>
                            <ul className="list-disc ml-6">
                                {selectedReview.negativesSides?.map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReviewsAll;