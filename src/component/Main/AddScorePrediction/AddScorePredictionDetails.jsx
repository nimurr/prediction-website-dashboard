import { useMemo } from "react";
import {
    ConfigProvider,
    Table,
    Tag,
    Space,
    Tooltip,
} from "antd";
import { AiOutlineEye } from "react-icons/ai";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { useGetSingleScorePredictionQuery } from "../../../redux/features/scorePrediction/scorePrediction";
import moment from "moment";

const StatusTag = ({ status }) => {
    if (status) {
        return <Tag color="green">Winner</Tag>;
    }
    // keep label exactly as provided ("lossed")
    return <Tag color="red">Yet to Results</Tag>;
};

const AddScorePredictionDetails = () => {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleScorePredictionQuery(id);
    const mainData = data?.data;

    const columns = useMemo(
        () => [
            {
                title: "Casino Username",
                dataIndex: "casinoUsername",
                key: "casinoUsername",
            },
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
                title: "Choosed Team",
                dataIndex: "selectTeam",
                key: "selectTeam",
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
                                to={`/add-score-prediction/user-details/${record?.userId || ""}?prediction=${id}`}
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
            {/* Header / Match info */}
            <div className="rounded-xl border border-[#704AAA]/30 bg-white p-5 mb-6">
                <h1 className="text-2xl font-semibold mb-1">{mainData?.sportTitle}</h1>
                <h2 className="text-4xl flex items-center gap-5 my-3">
                    <img className="w-10" src="/Sport/ball.png" alt="" />
                    {mainData?.firstTeamName} vs {mainData?.secondTeamName}
                </h2>
                <p className="text-sm text-gray-600">
                    {mainData?.predictionDeadline
                        ? moment(mainData.predictionDeadline).format("MMMM Do YYYY")
                        : ""}
                </p>
                <p className="mt-3 text-gray-800">{mainData?.sportDescription}</p>
            </div>

            {/* Predictors table */}
            <div className="rounded-xl bg-white border border-[#704AAA]/30">
                <div className="px-4 py-3 border-b border-[#704AAA]/30">
                    <h3 className="text-lg font-semibold">Predictors</h3>
                </div>

                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: "#704AAA",
                                headerColor: "#fff",
                                headerBorderRadius: 6,
                            },
                        },
                    }}
                >
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={mainData?.applyAllPredictions || []}
                        loading={isLoading}
                        pagination={{
                            pageSize: 10,
                            position: ["bottomRight"],
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </ConfigProvider>
            </div>
        </section>
    );
};

export default AddScorePredictionDetails;
