import { useMemo, useState } from "react";
import {
    ConfigProvider,
    Table,
    Tag,
    Space,
    Tooltip,
    Input,
    Button,
} from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useGetSinglePricePredictionQuery } from "../../../redux/features/pricePrediction/pricePrediction";
import moment from "moment";

const StatusTag = ({ status }) => {
    if (status?.toLowerCase() === "winner") {
        return <Tag color="green">Winner</Tag>;
    }
    return <Tag color="red">lossed</Tag>;
};

const AddPricepredictionDetails = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetSinglePricePredictionQuery(id);
    const mainData = data?.data;

    // 🔍 Search state
    const [searchValue, setSearchValue] = useState("");

    // Filtered data based on search
    const filteredData = useMemo(() => {
        if (!searchValue) return mainData?.applyPricePredictions || [];
        return (mainData?.applyPricePredictions || []).filter((item) =>
            item.predictedPrice
                ?.toString()
                .toLowerCase()
                .includes(searchValue.toLowerCase())
        );
    }, [mainData, searchValue]);

    const columns = useMemo(
        () => [
            { title: "Casino Username", dataIndex: "casinoUsername", key: "casinoUsername" },
            { title: "Bitcointalk Username", dataIndex: "bitcointalkUsername", key: "bitcointalkUsername" },
            {
                title: "Bitcoin Address",
                dataIndex: "bitcoinAddress",
                key: "bitcoinAddress",
                ellipsis: true,
                render: (addr) => <span className="font-mono">{addr}</span>,
            },
            { title: "Email", dataIndex: "email", key: "email" },
            {
                title: "Price Predict",
                dataIndex: "predictedPrice",
                key: "predictedPrice",
                render: (s) => <span>{s}$</span>,
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
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
                                to={`/add-price-prediction/user-details/${record?.userId}?predictionId=${id}`}
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
                <h1 className="text-2xl font-semibold mb-1">{mainData?.bitcoinTitle}</h1>
                <h2 className="text-4xl flex items-center gap-5 my-3">
                    <img className="w-10" src="/Sport/btc.png" alt="" />
                </h2>
                <p className="text-sm text-gray-600">
                    {mainData?.predictionDeadline
                        ? moment(mainData?.predictionDeadline).format("lll")
                        : ""}
                </p>
                <p className="mt-3 text-gray-800">{mainData?.bitcoinSubtitle}</p>
            </div>

            {/* Predictors table */}
            <div className="rounded-xl bg-white border border-[#704AAA]/30">
                <div className="px-4 py-3 border-b border-[#704AAA]/30 flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-lg font-semibold">Predictors</h3>

                    {/* Search by Price */}
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by Price"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="min-w-60"
                        />
                        <Button type="primary" onClick={() => setSearchValue("")}>
                            Reset
                        </Button>
                    </div>
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
                        rowKey={(record) => record?.userId}
                        columns={columns}
                        dataSource={filteredData}
                        loading={isLoading}
                        pagination={{
                            pageSize: 6,
                            position: ["bottomCenter"],
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </ConfigProvider>
            </div>
        </section>
    );
};

export default AddPricepredictionDetails;
