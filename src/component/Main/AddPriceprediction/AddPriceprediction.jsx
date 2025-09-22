import { useState, useMemo, useEffect } from "react";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useCreatePricePredictionMutation, useDeletePricePredictionMutation, useGetAllPricePredictionsQuery, useUpdatePricePredictionMutation } from "../../../redux/features/pricePrediction/pricePrediction";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import moment from "moment";

const { TextArea } = Input;

const AddPriceprediction = () => {
    const { data } = useGetAllPricePredictionsQuery();
    const allPricePredictionData = data?.data || [];

    const [form] = Form.useForm();
    const [rows, setRows] = useState([]);

    // ✅ keep rows in sync with API data
    useEffect(() => {
        if (allPricePredictionData.length > 0) {
            setRows(allPricePredictionData);
        }
    }, [allPricePredictionData]);

    // Add/Edit modal state
    const [openForm, setOpenForm] = useState(false);
    const [mode, setMode] = useState("add"); // "add" | "edit"
    const [editingRow, setEditingRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const columns = useMemo(
        () => [
            {
                title: "Bitcoin Info + Image",
                key: "info",
                render: (_, r) => (
                    <div className="flex items-center gap-3">
                        <img
                            src={r.bitcoinImage ? imageBaseUrl + r.bitcoinImage : r.imageUrl}
                            alt={r.bitcoinTitle || r.title}
                            className="w-10 h-10 rounded object-cover"
                        />
                        <div className="leading-tight">
                            <div className="font-medium">{r.bitcoinTitle || r.title}</div>
                        </div>
                    </div>
                ),
            },
            {
                title: "Bitcoin Subtitle",
                dataIndex: "bitcoinSubtitle",
                key: "bitcoinSubtitle",
                ellipsis: true,
                render: (s) => <span className="font-mono">{s}</span>,
            },
            {
                title: "DateLine",
                dataIndex: "predictionDeadline",
                key: "predictionDeadline",
                ellipsis: true,
                render: (s) => <span className="font-mono">{moment(s).format("D-MM-YYYY")}</span>,
            },
            {
                title: "sponsorLink",
                dataIndex: "sponsorLink",
                key: "sponsorLink",
                ellipsis: true,
                render: (_, item) => <Link target="_blank" to={item.sponsorLink} className="">{item.sponsorLink}</Link>,
            },

            {
                title: "Reward Amount",
                dataIndex: "predictedPrice",
                key: "predictedPrice",
                ellipsis: true,
                render: (s) => (
                    <p to={s} className="font-mono">
                        {s}$
                    </p>
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
                                to={`/add-price-prediction/${record._id}`}
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
                                <button className="p-2 rounded hover:bg-gray-100" aria-label="Delete">
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

    // Add New
    const handleAddNew = () => {
        setMode("add");
        setEditingRow(null);
        form.resetFields();
        setOpenForm(true);
    };

    // Edit
    const handleEdit = (row) => {
        setMode("edit");
        setEditingRow(row);
        console.log(row);
        form.setFieldsValue({
            id: row?._id,
            image: row.bitcoinImage
                ? [
                    {
                        uid: "-1",
                        name: "image",
                        status: "done",
                        url: imageBaseUrl + row.bitcoinImage,
                    },
                ]
                : [],
            title: row.bitcoinTitle || row.title,
            subtitle: row.bitcoinSubtitle || row.subtitle,
            predictedPrice: row.predictedPrice,
            sponsorLink: row.sponsorLink,
            sponsorName: row.sponsorName,
            deadline: row.predictionDeadline ? dayjs(row.predictionDeadline) : null,
        });
        setOpenForm(true);
    };

    const [deletePricePrediction] = useDeletePricePredictionMutation();
    // Delete
    const handleDelete = async (id) => {


        try {
            const response = await deletePricePrediction(id).unwrap();
            console.log(response);
            if (response?.code === 200) {
                message.success("Bitcoin prediction deleted successfully.");
            }
        } catch (error) {
            message.error("Failed to delete Bitcoin prediction.");
        }

    };

    const [createPricePrediction] = useCreatePricePredictionMutation();
    const [updatePricePrediction] = useUpdatePricePredictionMutation();

    // Submit (Add/Edit)
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Upload fileList → url
            const fileList = values.image || [];
            const imageUrl = fileList[0]?.originFileObj;

            // ✅ dayjs → string/ISO
            const deadlineStr = values.deadline ? values.deadline.toISOString() : "";

            if (mode === "add") {
                const newRow = {
                    // id: `row-${Date.now()}`,
                    bitcoinTitle: values.title,
                    bitcoinSubtitle: values.subtitle,
                    predictedPrice: values.predictedPrice,
                    sponsorLink: values.sponsorLink,
                    sponsorName: values.sponsorName,
                    predictionDeadline: deadlineStr,
                    bitcoinImage: imageUrl,
                };
                setRows((prev) => [newRow, ...prev]);


                try {
                    const formData = new FormData();
                    formData.append("bitcoinImage", imageUrl);
                    formData.append("bitcoinTitle", values.title);
                    formData.append("bitcoinSubtitle", values.subtitle);
                    formData.append("predictedPrice", values.predictedPrice);
                    formData.append("sponsorLink", values.sponsorLink);
                    formData.append("sponsorName", values.sponsorName);
                    formData.append("predictionDeadline", deadlineStr);

                    const response = await createPricePrediction(formData).unwrap();
                    if (response?.code == 201) {
                        message.success("New Bitcoin prediction added!");
                        setOpenForm(false);
                        setEditingRow(null);
                    }
                } catch (error) {
                    message.error("Failed to add new Bitcoin prediction.");
                    console.error(error);
                }


            } else if (mode === "edit" && editingRow) {
                console.log(editingRow?._id);
                setRows((prev) =>
                    prev.map((r) =>
                        r.id === editingRow.id
                            ? {
                                ...r,
                                bitcoinTitle: values.title,
                                bitcoinSubtitle: values.subtitle,
                                predictedPrice: values.predictedPrice,
                                sponsorLink: values.sponsorLink,
                                sponsorName: values.sponsorName,
                                predictionDeadline: deadlineStr,
                                bitcoinImage: imageUrl,
                            }
                            : r
                    )
                );
                try {
                    const formData = new FormData();
                    if (imageUrl) {
                        formData.append("bitcoinImage", imageUrl);
                    }
                    formData.append("bitcoinTitle", values.title);
                    formData.append("bitcoinSubtitle", values.subtitle);
                    formData.append("predictedPrice", values.predictedPrice);
                    formData.append("sponsorLink", values.sponsorLink);
                    formData.append("sponsorName", values.sponsorName);
                    formData.append("predictionDeadline", deadlineStr);
                    console.log(editingRow.id);


                    const response = await updatePricePrediction({ formData, id: editingRow?._id }).unwrap();
                    console.log(response);

                    if (response?.code == 200) {
                        message.success("Bitcoin prediction updated!");
                        setOpenForm(false);
                        setEditingRow(null);
                    }
                } catch (error) {
                    message.error("Failed to update Bitcoin prediction.");
                }
            }
            form.resetFields();
        } catch {
            // validation shown by antd
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-5 px-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Price Prediction Management</h2>
                <button
                    className="bg-[#704AAA] py-3 px-8 rounded-lg text-white"
                    onClick={handleAddNew}
                >
                    Add New Bitcoin
                </button>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#704AAA",
                            headerColor: "#fff",
                            headerBorderRadius: 5,
                            fontSize: "16px",
                        },
                        Modal: {
                            headerBg: "#fff",
                        },
                    },
                }}
            >
                <Table
                    dataSource={rows}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5, position: ["bottomCenter"] }}
                />
            </ConfigProvider>

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
                okText={mode === "add" ? "Add" : "Save Changes"}
                confirmLoading={submitting}
                centered
            >
                <Form form={form} layout="vertical">
                    <div className="my-10">
                        <h2 className="text-3xl font-semibold mb-3">
                            {mode === "add" ? "Add New Bitcoin" : "Edit Bitcoin Details"}
                        </h2>
                        <p className="text-xl">
                            {mode === "add"
                                ? "Enter the Bitcoin details below to add it to the system."
                                : "Update the Bitcoin information below."}
                        </p>
                    </div>

                    {/* Upload Bitcoin Image */}
                    <Form.Item
                        label="Upload Bitcoin Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        rules={[{ required: true, message: "Please upload a picture" }]}
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

                    {/* Bitcoin Title */}
                    <Form.Item
                        label="Bitcoin Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter title" }]}
                    >
                        <Input className="!h-12" placeholder="Enter Bitcoin Title" />
                    </Form.Item>

                    {/* Bitcoin Subtitle */}
                    <Form.Item
                        label="Bitcoin Subtitle"
                        name="subtitle"
                        rules={[{ required: true, message: "Please enter subtitle" }]}
                    >
                        <Input className="!h-12" placeholder="Enter Subtitle" />
                    </Form.Item>

                    {/* Join Link */}
                    <Form.Item
                        label="Reward"
                        name="predictedPrice"
                        rules={[{ required: true, message: "Please enter Reward Amount" }]}
                    >
                        <Input className="!h-12" placeholder="Enter Reward Amount" />
                    </Form.Item>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Form.Item
                            label="sponsorName"
                            name="sponsorName"
                            rules={[{ required: true, message: "Enter Your Sponsor Name" }]}
                        >
                            <Input className="!h-12" placeholder="Enter Your Sponsor Name" />
                        </Form.Item>
                        <Form.Item
                            label="sponsorLink"
                            name="sponsorLink"
                            rules={[{ required: true, message: "Enter Your Sponsor Link" }]}
                        >
                            <Input className="!h-12" placeholder="Enter Your Sponsor Link" />
                        </Form.Item>

                    </div>


                    {/* Prediction Deadline */}
                    <Form.Item
                        label="Prediction Deadline"
                        name="deadline"
                        rules={[{ required: true, message: "Select deadline" }]}
                    >
                        <DatePicker
                            className="!h-12"
                            style={{ width: "100%" }}
                            showTime
                            placeholder="Select deadline"
                            disabledDate={(current) => current && current < moment().startOf("day")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default AddPriceprediction;
