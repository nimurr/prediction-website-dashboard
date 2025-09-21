import { useState } from "react";
import {
    Card,
    Typography,
    Tag,
    Button,
    Space,
    Tooltip,
    Popconfirm,
    Modal,
    message,
    Divider,
} from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useGetFullDetailsQuery, useUpdateDeclareWinnerMutation } from "../../../redux/features/scorePrediction/scorePrediction";
import moment from "moment";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const { Text, Paragraph, Title } = Typography;

const AddScorePredictionUserDetails = () => {

    // i want to get id and search userId 
    const { id } = useParams()
    const prediction = new URLSearchParams(window.location.search).get("prediction")

    const { data: userDetails } = useGetFullDetailsQuery({ userId: id, predictionId: prediction });
    const [updateDeclareWinner] = useUpdateDeclareWinnerMutation();


    const allInfo = userDetails?.data;
    const userInfo = allInfo?.user[0];
    const predictionInfo = allInfo?.prediction;

    console.log(userInfo);

    const handleDeclareWinner = async () => {
        // setStatus("Winner");
        try {

            const result = await updateDeclareWinner({ userId: id, predictionId: prediction });
            console.log(result);
            if (result?.data?.code == 200) {
                message.success("Declared as Winner");
            }
            if (result.error) {
                message.error(result?.error?.data?.message || "Failed to declare as winner");
                throw new Error(result.error);
            }
            // setStatus("Winner");
        } catch (error) {

        }
    };


    // Header content (from your test data)
    const header = {
        blockTitle: "Sport Predictors",
        sportLine: "Soccer: Real Madrid vs Barcelona",
        date: "July 20, 2025",
        blurb: "Predict final score. Win $50 in crypto.",
    };

    // Predictor details (from your test data)
    const [status, setStatus] = useState("Pending");
    const details = {
        btctalk: "CryptoKing007",
        btcAddress: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
        casinoUser: "LuckySpin777",
        email: "luckygamer777@example.com",
        team: "Barcelona",
        description:
            "Argentina will dominate possession and secure a 3-1 victory over Brazil in the upcoming Copa America final, with Messi scoring at least once.",
    };

    const [previewOpen, setPreviewOpen] = useState(false);

    const Row = ({ label, children }) => (
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 py-3">
            <div className="md:w-64 w-full text-gray-600 font-medium">{label}</div>
            <div className="flex-1">{children}</div>
        </div>
    );

    return (
        <section className="py-5 px-3">
            {/* Header / Match info */}
            <Card bordered className="mb-6 border-2 p-5 bg-gradient-to-tr to-purple-400 rounded-lg from-white border-[#704AAA]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {predictionInfo?.sportTitle}
                        </Title>
                        <h2 className="text-4xl flex items-center gap-5 my-3">
                            <img className="w-10 " src="/Sport/ball.png" alt="" />
                            {predictionInfo?.firstTeamName} vs {predictionInfo?.secondTeamName}
                        </h2>
                        <div className="text-sm text-gray-600">{moment(predictionInfo?.predictionDeadline).format("dddd, MMMM D, YYYY")}</div>
                        <Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
                            {predictionInfo?.sportDescription}
                        </Paragraph>
                    </div>


                </div>
            </Card>

            {/* Details (NOT a table) */}
            <Card
                bordered
                className="rounded-xl text-xl bg-[#704aaa51]"
                styles={{ body: { paddingTop: 8, paddingBottom: 8 } }}
            >
                <div className="px-1">
                    <div>
                        <img className="w-32 p-5 " src={userInfo?.userId?.profileImage ? imageBaseUrl + userInfo?.userId?.profileImage : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" />
                    </div>
                    <Row label="Bitcointalk Username">
                        <Text className="text-xl">{userInfo?.bitcointalkUsername}</Text>
                    </Row>
                    <Divider className="my-0" />
                    <Row label="Bitcoin Address">
                        <Text copyable className="text-xl font-mono break-all">
                            {userInfo?.bitcoinAddress}
                        </Text>
                    </Row>
                    <Divider className="my-0" />
                    <Row label="Casino Username">
                        <Text className="text-xl">{userInfo?.casinoUsername}</Text>
                    </Row>
                    <Divider className="my-0" />
                    <Row label="Bet ID">
                        <a href={`mailto:${userInfo?.BetID}`} className="break-all">
                            {userInfo?.BetID || 'N/A'}
                        </a>
                    </Row>
                    <Row label="Email (optional)">
                        <a href={`mailto:${userInfo?.email}`} className="break-all">
                            {userInfo?.email}
                        </a>
                    </Row>
                    <Row label="1st Goal ">
                        <a href={`mailto:${userInfo?.predictionTime}`} className="break-all">
                            {userInfo?.predictionTime}
                        </a>
                    </Row>
                    <Divider className="my-0" />
                    <Row label="Total Yellow Card">
                        <Tag className="text-xl" color="blue">{userInfo?.totalYellowCard}</Tag>
                    </Row>
                    <Divider className="my-0" />
                    <Row label="Wining Status">
                        <Paragraph className="text-xl" style={{ marginBottom: 0, whiteSpace: "pre-line" }}>
                            {userInfo?.isWinner ? <Tag color="green">Winner</Tag> : <Tag color="orange">Pending</Tag>}
                        </Paragraph>
                    </Row>
                    <Space>
                        <button onClick={handleDeclareWinner} className="bg-[#704AAA] text-white py-3 px-8 rounded-lg">Declare As Winner</button>
                    </Space>
                </div>
            </Card>


        </section>
    );
};

export default AddScorePredictionUserDetails;
