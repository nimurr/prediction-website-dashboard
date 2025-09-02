import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

const ReviewsAll = () => {
    const [data, setData] = useState([
        {
            key: "1",
            image: "https://example.com/review.png",
            bonusTitle: "Welcome Bonus",
            freeSpinsBonus: "50 Free Spins",
            lastUpdateDate: "2025-08-25",
            adminAvgRating: 4.5,
            userAvgRating: 4.2,
            summaryTitle: "Top Casino Review",
            allInfo: [
                { heading: "Info 1", description: "Description 1" },
                { heading: "Info 2", description: "Description 2" },
            ],
            positiveSide: [{ heading: "Good payout" }, { heading: "Fast support" }],
            negativeSide: [{ heading: "Limited games" }],
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const handleView = (record) => {
        setSelectedReview(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text) => <img src={text} alt="review" style={{ width: 50 }} />,
        },
        {
            title: "Bonus Title",
            dataIndex: "bonusTitle",
            key: "bonusTitle",
        },
        {
            title: "Free Spins",
            dataIndex: "freeSpinsBonus",
            key: "freeSpinsBonus",
        },
        {
            title: "Admin Rating",
            dataIndex: "adminAvgRating",
            key: "adminAvgRating",
        },
        {
            title: "User Rating",
            dataIndex: "userAvgRating",
            key: "userAvgRating",
        },
        {
            title: "Summary",
            dataIndex: "summaryTitle",
            key: "summaryTitle",
        },
        {
            title: "Last Update",
            dataIndex: "lastUpdateDate",
            key: "lastUpdateDate",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-5 items-center text-base">
                    <Link to={`/reviews-all/edit-review/${record.key}`}>
                        <FaRegEdit className="text-blue-800 size-5" />
                    </Link>
                    <button
                        className="text-[#704AAA]"
                        onClick={() => handleView(record)}
                    >
                        <IoEyeOutline className="size-6" />
                    </button>
                </div>
            ),
        },
    ];

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
            <Table columns={columns} dataSource={data} rowKey="key" />

            {/* Modal for viewing all details */}
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
                                src={selectedReview.image}
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
                                {selectedReview.allInfo.map((info, i) => (
                                    <li key={i}>
                                        <strong>{info.heading}:</strong> {info.description}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <strong>Positive Side:</strong>
                            <ul className="list-disc ml-6">
                                {selectedReview.positiveSide.map((p, i) => (
                                    <li key={i}>{p.heading}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <strong>Negative Side:</strong>
                            <ul className="list-disc ml-6">
                                {selectedReview.negativeSide.map((n, i) => (
                                    <li key={i}>{n.heading}</li>
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
