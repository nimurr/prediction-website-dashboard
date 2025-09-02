import { useState } from "react";
import {
    Card,
    Typography,
    Tag,
    Space,
    Tooltip,
    Popconfirm,
    message,
    Divider,
} from "antd";
import { AiOutlineEye } from "react-icons/ai"; // (ভবিষ্যতে দরকার হলে)
const { Text, Paragraph, Title } = Typography;

const StatusTag = ({ status }) => {
    if (status?.toLowerCase() === "winner") return <Tag color="green">Winner</Tag>;
    return <Tag color="red">lossed</Tag>;
};

const AddPokerTournamentUserDetails = () => {
    // Tournament header (পূর্বের নির্দেশনা অনুযায়ী)
    const header = {
        blockTitle: "Poker Tournament Predictors",
        tournamentTitle: "Friday Night Showdown",
        buyIn: "$50",
        time: "Every Friday, 9 PM UTC",
        type: "No Limit Hold'em",
        maxPlayers: 500,
        sponsor: "Rollbit",
        rewards: "$5,000 Prize Pool + Tickets",
    };

    // এক জন প্রেডিক্টরের ডেমো ডেটা (টেবিলের উদাহরণ অনুযায়ী)
    const [status, setStatus] = useState("Winner"); // অথবা "lossed"
    const details = {
        userName: "Theodore Mosciski",
        btctalk: "CryptoNinja88",
        btcAddress: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
        predictedPrice: 92586, // $ 92,586
    };

    const Row = ({ label, children }) => (
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 py-3">
            <div className="md:w-64 w-full text-gray-600 font-medium">{label}</div>
            <div className="flex-1">{children}</div>
        </div>
    );

    return (
        <section className="py-5 px-3">
            {/* Header / Tournament info */}
            <Card
                bordered
                className="mb-6 text-[16px] border-2 p-5 bg-gradient-to-tr to-purple-400 rounded-lg from-white border-[#704AAA]"
            >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {header.blockTitle}
                        </Title>
                        <h2 className="text-4xl flex items-center gap-5 my-3">
                            <img className="w-10" src="/Sport/btc.png" alt="" />
                            {header.tournamentTitle}
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 text-gray-800">
                            <p><span className="font-semibold">Buy In:</span> {header.buyIn}</p>
                            <p><span className="font-semibold">Time:</span> {header.time}</p>
                            <p><span className="font-semibold">Type:</span> {header.type}</p>
                            <p><span className="font-semibold">Max Players:</span> {header.maxPlayers}</p>
                            <p><span className="font-semibold">Sponsor:</span> {header.sponsor}</p>
                            <p><span className="font-semibold">Rewards:</span> {header.rewards}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Predictor details */}
            <Card
                bordered
                className="rounded-xl text-xl bg-[#704aaa51]"
                styles={{ body: { paddingTop: 8, paddingBottom: 8 } }}
            >
                <div className="px-1">
                    <div>
                        <img className="w-48" src="/Sport/users-image.png" alt="" />
                    </div>

                    <Row label="User Name">
                        <Text className="text-xl">{details.userName}</Text>
                    </Row>
                    <Divider className="my-0" />

                    <Row label="Bitcointalk Username">
                        <Text className="text-xl">{details.btctalk}</Text>
                    </Row>
                    <Divider className="my-0" />

                    <Row label="Bitcoin Address">
                        <Text copyable className="text-xl font-mono break-all">
                            {details.btcAddress}
                        </Text>
                    </Row>
                    <Divider className="my-0" />

                    <Row label="Predicted Price">
                        <span className="text-xl">
                            $ {Number(details.predictedPrice).toLocaleString("en-US")}
                        </span>
                    </Row>
                    <Divider className="my-0" />

                    <Row label="Status">
                        <StatusTag status={status} />
                    </Row>

                    <div className="mt-3">
                        <Space>
                            <Popconfirm
                                title="Declare as Winner?"
                                description="This will mark this predictor as Winner."
                                okText="Confirm"
                                onConfirm={() => {
                                    setStatus("Winner");
                                    message.success("Declared as Winner");
                                }}
                            >
                                <button className="bg-[#704AAA] text-white py-3 px-8 rounded-lg">
                                    Declare As Winner
                                </button>
                            </Popconfirm>

                            <Popconfirm
                                title="Mark as lossed?"
                                description="This will mark this predictor as lossed."
                                okText="Confirm"
                                onConfirm={() => {
                                    setStatus("lossed");
                                    message.success("Marked as lossed");
                                }}
                            >
                                <button className="py-3 px-8 rounded-lg border border-[#704AAA]">
                                    Mark As lossed
                                </button>
                            </Popconfirm>
                        </Space>
                    </div>
                </div>
            </Card>
        </section>
    );
};

export default AddPokerTournamentUserDetails;
