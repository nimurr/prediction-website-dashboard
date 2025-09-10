import { useState, useMemo } from "react";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Tooltip,
    Popconfirm,
    Upload,
    message,
    Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
    useCreatePokerPredictionMutation,
    useDeletePokerTournamentMutation,
    useGetAllPokerTuranmentQuery,
    useUpdatePokerTuranamentMutation,
} from "../../../redux/features/pokerPrediction/pokerPrediction";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import moment from "moment";

const AddPokerTournament = () => {
    const { data, isLoading, refetch } = useGetAllPokerTuranmentQuery();
    const [createPokerTournament] = useCreatePokerPredictionMutation();
    const [updatePokerTournament] = useUpdatePokerTuranamentMutation();
    const [deletePokerTournament] = useDeletePokerTournamentMutation();
    const fullData = data?.data || [];

    const [form] = Form.useForm();
    const [openForm, setOpenForm] = useState(false);
    const [mode, setMode] = useState("add"); // "add" | "edit"
    const [editingRow, setEditingRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const columns = useMemo(
        () => [
            {
                title: "Poker Info + Image",
                key: "info",
                render: (_, r) => (
                    <div className="flex items-center gap-3">
                        <img
                            src={imageBaseUrl + r.uploadPokerTournamentImage}
                            alt={r.title}
                            className="w-10 h-10 rounded object-cover"
                        />
                    </div>
                ),
            },
            {
                title: "Title",
                dataIndex: "pokerTournamentTitle",
                key: "pokerTournamentTitle",
            },
            {
                title: "Buy In",
                dataIndex: "buyIn",
                key: "buyIn",
                render: (_, r) => <span>{r.buyIn}$</span>,
            },
            {
                title: "Time",
                key: "time",
                render: (_, r) =>
                    r.time ? dayjs(r.time).format("DD-MMM-YYYY HH:mm") : "",
            },
            {
                title: "Type",
                dataIndex: "type",
                key: "type",
            },
            {
                title: "Max Players",
                dataIndex: "maxPlayers",
                key: "maxPlayers",
            },
            {
                title: "Sponsor",
                dataIndex: "sponsor",
                key: "sponsor",
            },
            {
                title: "Rewards",
                dataIndex: "rewards",
                key: "rewards",
                render: (_, r) => <span>{r.rewards}$</span>,
            },
            {
                title: "Join Link",
                key: "joinLink",
                render: (_, r) =>
                    r.joinLink ? (
                        <a
                            href={r.joinLink}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-blue-600"
                        >
                            Open
                        </a>
                    ) : (
                        ""
                    ),
            },
            {
                title: "Action",
                key: "action",
                align: "center",
                render: (_, record) => (
                    <Space size="middle" className="justify-center">
                        <Tooltip title="View">
                            <Link
                                to={`/add-poker-tournament/${record._id}`}
                                className="inline-block rounded hover:bg-gray-100"
                                aria-label="View"
                            >
                                <AiOutlineEye className="text-xl" />
                            </Link>
                        </Tooltip>

                        <Tooltip title="Edit">
                            <button
                                onClick={() => handleEdit(record)}
                                className="p-2 rounded hover:bg-gray-100"
                                aria-label="Edit"
                            >
                                <FiEdit2 className="text-xl" />
                            </button>
                        </Tooltip>

                        <Popconfirm
                            title="Delete this item?"
                            description="This action cannot be undone."
                            okText="Delete"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleDelete(record._id)}
                        >
                            <Tooltip title="Delete">
                                <button
                                    className="p-2 rounded hover:bg-gray-100"
                                    aria-label="Delete"
                                >
                                    <RiDeleteBinLine className="text-xl text-red-500" />
                                </button>
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        []
    );

    const handleAddNew = () => {
        setMode("add");
        setEditingRow(null);
        form.resetFields();
        setOpenForm(true);
    };

    const handleEdit = (row) => {
        setMode("edit");
        setEditingRow(row);
        form.setFieldsValue({
            id: row._id,
            image: row.uploadPokerTournamentImage
                ? [
                    {
                        uid: "-1",
                        name: "image",
                        status: "done",
                        url: imageBaseUrl + row.uploadPokerTournamentImage,
                    },
                ]
                : [],
            pokerTournamentTitle: row.pokerTournamentTitle,
            buyIn: row.buyIn,
            time: row.time ? dayjs(row.time) : null,
            type: row.type,
            maxPlayers: row.maxPlayers,
            sponsor: row.sponsor,
            rewards: row.rewards,
            joinLink: row.joinLink,
        });
        setOpenForm(true);
    };

    const handleDelete = async (id) => {

        try {
            console.log(id);

            const res = await deletePokerTournament(id).unwrap();
            console.log(res);
            if (res?.code == 200) {
                message.success("Deleted successfully!");
            }

            refetch(); // ✅ refresh list after delete
        } catch {
            message.error("Delete failed!");
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const fileList = values.image || [];
            const file = fileList[0]?.originFileObj || null;

            const formData = new FormData();
            if (file) {
                formData.append("uploadPokerTournamentImage", file);
            }
            formData.append("pokerTournamentTitle", values.pokerTournamentTitle);
            formData.append("buyIn", values.buyIn);
            formData.append("time", values.time ? values.time.toISOString() : "");
            formData.append("type", values.type);
            formData.append("maxPlayers", values.maxPlayers);
            formData.append("sponsor", values.sponsor);
            formData.append("rewards", values.rewards);
            formData.append("joinLink", values.joinLink);

            if (mode === "add") {
                await createPokerTournament(formData).unwrap();
                message.success("Poker tournament added successfully!");
            } else if (mode === "edit" && editingRow) {

                const formData = new FormData();
                if (file) {
                    formData.append("uploadPokerTournamentImage", file);
                }
                formData.append("pokerTournamentTitle", values.pokerTournamentTitle);
                formData.append("buyIn", values.buyIn);
                formData.append("time", values.time ? values.time.toISOString() : "");
                formData.append("type", values.type);
                formData.append("maxPlayers", values.maxPlayers);
                formData.append("sponsor", values.sponsor);
                formData.append("rewards", values.rewards);
                formData.append("joinLink", values.joinLink);

                const response = await updatePokerTournament({ formData, id: editingRow._id }).unwrap();
                if (response?.code == 200) {
                    message.success("Poker tournament updated successfully!");
                }
            }

            setOpenForm(false);
            setEditingRow(null);
            form.resetFields();
            refetch(); // ✅ refresh table data after add/edit
        } catch (error) {
            console.error("Error:", error);
            message.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-5 px-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    Poker Tournament Management
                </h2>
                <button
                    className="bg-[#704AAA] py-3 px-8 rounded-lg text-white"
                    onClick={handleAddNew}
                >
                    Add New Poker Tournament
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Spin size="large" />
                </div>
            ) : (
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                fontSize: "16px",
                                headerBg: "#704AAA",
                                headerColor: "#fff",
                                headerBorderRadius: 5,
                            },
                            Modal: {
                                headerBg: "#fff",
                            },
                        },
                    }}
                >
                    <Table
                        dataSource={fullData}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5, position: ["bottomCenter"] }}
                    />
                </ConfigProvider>
            )}

            {/* Add/Edit Modal */}
            <Modal
                open={openForm}
                onCancel={() => {
                    setOpenForm(false);
                    setEditingRow(null);
                    form.resetFields();
                }}
                width={800}
                onOk={handleSubmit}
                okText="Save"
                confirmLoading={submitting}
                centered
            >
                <Form form={form} layout="vertical">
                    <div className="my-10">
                        <h2 className="text-3xl font-semibold mb-3">
                            {mode === "add"
                                ? "Add New Poker Tournament"
                                : "Edit Poker Tournament"}
                        </h2>
                        <p className="text-xl">
                            Enter the poker tournament details below. Ensure all fields
                            are accurate before submitting.
                        </p>
                    </div>

                    {/* Upload Poker Tournament Image */}
                    <Form.Item
                        label="Upload Poker Tournament Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                            { required: true, message: "Upload Poker Tournament Image" },
                        ]}
                    >
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    {/* Poker Tournament Title */}
                    <Form.Item
                        label="Poker Tournament Title"
                        name="pokerTournamentTitle"
                        rules={[
                            { required: true, message: "Enter Poker Tournament Title" },
                        ]}
                    >
                        <Input
                            className="!h-12"
                            placeholder="Enter Poker Tournament Title"
                        />
                    </Form.Item>

                    {/* Buy In */}
                    <Form.Item
                        label="Buy In"
                        name="buyIn"
                        rules={[{ required: true, message: "Enter Buy In" }]}
                    >
                        <Input className="!h-12" placeholder="Enter Buy In" />
                    </Form.Item>

                    {/* Time */}
                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[
                            { required: true, message: "Enter Poker Tournament Time" },
                        ]}
                    >
                        <DatePicker
                            className="!h-12"
                            style={{ width: "100%" }}
                            showTime
                            placeholder="Enter Poker Tournament Time"
                            disabledDate={(current) => current && current < moment().startOf("day")}
                        />
                    </Form.Item>

                    {/* Type */}
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            { required: true, message: "Enter Poker Tournament Type" },
                        ]}
                    >
                        <Input
                            className="!h-12"
                            placeholder="Enter Poker Tournament Type"
                        />
                    </Form.Item>

                    {/* Max Players */}
                    <Form.Item
                        label="Max Players"
                        name="maxPlayers"
                        rules={[
                            {
                                required: true,
                                message: "Enter Poker Tournament Max Players",
                            },
                        ]}
                    >
                        <Input
                            className="!h-12"
                            type="number"
                            placeholder="Enter Poker Tournament Max Players"
                        />
                    </Form.Item>

                    {/* Sponsor */}
                    <Form.Item
                        label="Sponsor"
                        name="sponsor"
                        rules={[
                            { required: true, message: "Enter Poker Tournament Sponsor" },
                        ]}
                    >
                        <Input
                            className="!h-12"
                            placeholder="Enter Poker Tournament Sponsor"
                        />
                    </Form.Item>

                    {/* Rewards */}
                    <Form.Item
                        label="Rewards"
                        name="rewards"
                        rules={[
                            { required: true, message: "Enter Poker Tournament Rewards" },
                        ]}
                    >
                        <Input
                            className="!h-12"
                            placeholder="Enter Poker Tournament Rewards"
                        />
                    </Form.Item>

                    {/* Join Link */}
                    <Form.Item
                        label="Join Link"
                        name="joinLink"
                        rules={[
                            { required: true, message: "Enter Join Link" },
                            { type: "url", message: "Enter a valid URL" },
                        ]}
                    >
                        <Input className="!h-12" placeholder="Enter Join Link" />
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default AddPokerTournament;
