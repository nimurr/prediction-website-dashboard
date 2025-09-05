import { useMemo } from "react";
import { ConfigProvider, Table, Tag, Space, Tooltip, Spin } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useSingleFullPokerTournamentQuery } from "../../../redux/features/pokerPrediction/pokerPrediction";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const StatusTag = ({ status }) => {
    if (status) return <Tag color="green">Winner</Tag>;
    return <Tag color="red">Yet to Results</Tag>;
};

const AddPokerTournamentDetails = () => {
    const { id } = useParams();
    const { data, isLoading } = useSingleFullPokerTournamentQuery(id);

    const fullData = data?.data;
    console.log(fullData);
    const rows = fullData?.applyPokerTournamentUsers || [];


    const columns = useMemo(
        () => [
            { title: "User Name", dataIndex: "casinoUsername", key: "casinoUsername" },
            {
                title: "Bitcointalk Username",
                dataIndex: "bitcointalkUsername",
                key: "bitcointalkUsername",
            },
            {
                title: "Bitcoin Address",
                dataIndex: "bitcoinAddress",
                key: "bitcoinAddress",
                ellipsis: true,
                render: (addr) => <span className="font-mono">{addr}</span>,
            },
            {
                title: "Predicted Price",
                dataIndex: "predictedPrice",
                key: "predictedPrice",
                render: (v) => (v ? <span className="font-mono">${v}</span> : "N/A"),
            },
            {
                title: "Link to screenshot",
                dataIndex: "screenshotLink",
                key: "screenshotLink",
                render: (v) =>
                    v ? (
                        <Link target="_blank" to={v}>
                            Open Url
                        </Link>
                    ) : (
                        "N/A"
                    ),
            },
            {
                title: "Status",
                dataIndex: "isWinner",
                key: "isWinner",
                render: (s) => <StatusTag status={s} />,
            },
            {
                title: "Action",
                key: "action",
                align: "center",
                render: (_, record) => (
                    <Space>
                        <Tooltip title="View">
                            <Link
                                to={`/add-poker-tournament/predictor/${record._id}?predictionId=${fullData?._id}`}
                                className="p-2 inline-block rounded hover:bg-gray-100"
                            >
                                <AiOutlineEye className="text-xl" />
                            </Link>
                        </Tooltip>
                    </Space>
                ),
            },
        ],
        []
    );

    return (
        <section className="py-5 px-3">
            {/* Header / Tournament info */}
            <div className="rounded-xl border border-[#704AAA]/30 bg-white p-5 mb-6">
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-1">
                            {fullData?.pokerTournamentTitle}
                        </h1>

                        <h2 className="text-4xl flex items-center gap-5 my-3">
                            {fullData?.uploadPokerTournamentImage && (
                                <img
                                    className="w-10"
                                    src={imageBaseUrl + fullData?.uploadPokerTournamentImage}
                                    alt="Tournament"
                                />
                            )}
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-gray-800">
                            <p>
                                <span className="font-semibold">Buy In:</span> ${fullData?.buyIn}
                            </p>
                            <p>
                                <span className="font-semibold">Time:</span> {fullData?.time}
                            </p>
                            <p>
                                <span className="font-semibold">Type:</span> {fullData?.type}
                            </p>
                            <p>
                                <span className="font-semibold">Max Players:</span>{" "}
                                {fullData?.maxPlayers}
                            </p>
                            <p>
                                <span className="font-semibold">Sponsor:</span>{" "}
                                {fullData?.sponsor}
                            </p>
                            <p>
                                <span className="font-semibold">Rewards:</span>{" "}
                                {fullData?.rewards}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Predictors table */}
            <div className="rounded-xl bg-white border border-[#704AAA]/30">
                <div className="px-4 py-3 border-b border-[#704AAA]/30 flex items-center justify-between flex-wrap">
                    <h3 className="text-lg font-semibold">Predictors</h3>
                </div>

                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: "#704AAA",
                                headerColor: "#fff",
                                headerBorderRadius: 6,
                                fontSize: "16px",
                            },
                        },
                    }}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" tip="Loading table..." />
                        </div>
                    ) : (
                        <Table
                            rowKey="_id"
                            columns={columns}
                            dataSource={rows}
                            pagination={{ pageSize: 6, position: ["bottomCenter"] }}
                            scroll={{ x: "max-content" }}
                            locale={{
                                emptyText: "No predictors found",
                            }}
                        />
                    )}
                </ConfigProvider>
            </div>
        </section>
    );
};

export default AddPokerTournamentDetails;
