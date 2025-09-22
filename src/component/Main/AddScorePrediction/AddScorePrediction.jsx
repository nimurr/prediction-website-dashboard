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
import dayjs from "dayjs";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useCreateScorePredictionMutation, useDeleteScorePredictionMutation, useGetAllPredictionsQuery, useUpdateScorePredictionMutation } from "../../../redux/features/scorePrediction/scorePrediction";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import moment from "moment";

const { TextArea } = Input;

const AddScorePrediction = () => {
    const { data, isLoading } = useGetAllPredictionsQuery();
    const predictionData = data?.data || [];
    const [createScorePrediction] = useCreateScorePredictionMutation();
    const [updateScorePrediction] = useUpdateScorePredictionMutation();
    const [deleteScorePrediction] = useDeleteScorePredictionMutation();

    const [form] = Form.useForm();
    const [rows, setRows] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [mode, setMode] = useState("add");
    const [editingRow, setEditingRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Sync fetched data into table rows
    useEffect(() => {
        if (predictionData.length) {
            setRows(predictionData);
        }
    }, [predictionData]);

    // Add New
    const handleAddNew = () => {
        setMode("add");
        setEditingRow(null);
        form.resetFields();
        setOpenForm(true);
    };

    const [id, setId] = useState(null);

    // Edit
    const handleEdit = (row) => {
        // console.log(row?._id);
        setId(row._id);
        setMode("edit");
        setEditingRow(row);
        form.setFieldsValue({
            id: row._id,
            image: row.sportImage
                ? [
                    {
                        uid: "-1",
                        name: "image",
                        status: "done",
                        url: imageBaseUrl + row.sportImage,
                    },
                ]
                : [],
            sportTitle: row.sportTitle,
            sportDescription: row.sportDescription,
            firstTeamName: row.firstTeamName,
            secondTeamName: row.secondTeamName,
            sponsorLink: row.sponsorLink,
            sponsorName: row.sponsorName,
            predictionDeadline: row.predictionDeadline ? dayjs(row.predictionDeadline) : null,
        });
        setOpenForm(true);
    };

    // Delete
    const handleDelete = async (id) => {
        const res = await deleteScorePrediction(id).unwrap();
        message.success("Deleted Successfully");
    };

    // Submit
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const fileList = values.image || [];
            const sportImage = fileList[0]?.url || "";


            const newRow = {
                sportImage: values.image[0].originFileObj,
                sportTitle: values.sportTitle,
                sportDescription: values.sportDescription,
                firstTeamName: values.firstTeamName,
                secondTeamName: values.secondTeamName,
                sponsorLink: values.sponsorLink,
                sponsorName: values.sponsorName,
                predictionDeadline: values.predictionDeadline?.toISOString()
            };

            if (mode === "add") {
                setRows((prev) => [newRow, ...prev]);

                const formData = new FormData();
                formData.append("sportImage", values.image[0].originFileObj);
                formData.append("sportTitle", values.sportTitle);
                formData.append("sportDescription", values.sportDescription);
                formData.append("firstTeamName", values.firstTeamName);
                formData.append("secondTeamName", values.secondTeamName);
                formData.append("sponsorLink", values.sponsorLink);
                formData.append("sponsorName", values.sponsorName);
                formData.append("predictionDeadline", values.predictionDeadline?.toISOString());


                const res = await createScorePrediction(formData).unwrap();
                console.log(res);
                setOpenForm(false);
                message.success("New prediction added!");


            } else {

                const formData = new FormData();
                if (values.image[0].originFileObj) {
                    formData.append("sportImage", values.image[0].originFileObj);
                }
                formData.append("sportTitle", values.sportTitle);
                formData.append("sportDescription", values.sportDescription);
                formData.append("firstTeamName", values.firstTeamName);
                formData.append("secondTeamName", values.secondTeamName);
                formData.append("sponsorLink", values.sponsorLink);
                formData.append("sponsorName", values.sponsorName);
                formData.append("predictionDeadline", values.predictionDeadline?.toISOString());


                const res = await updateScorePrediction({ id, formData }).unwrap();

                console.log(res);

                message.success("Prediction updated!");
            }

            setOpenForm(false);
            setEditingRow(null);
            form.resetFields();
        } catch {
            // Validation handled by AntD
        } finally {
            setSubmitting(false);
        }
    };

    // Table Columns
    const columns = useMemo(
        () => [
            {
                title: "Sport Info",
                key: "sportInfo",
                render: (_, r) => `${r.firstTeamName} vs ${r.secondTeamName} - ${r.sportTitle}`,
            },
            {
                title: "Description",
                dataIndex: "sportDescription",
                key: "sportDescription",
                ellipsis: true,
            },
            {
                title: "sponsorName",
                dataIndex: "sponsorName",
                key: "sponsorName",
                ellipsis: true,
            },
            {
                title: "sponsorLink",
                dataIndex: "sponsorLink",
                key: "sponsorLink",
                ellipsis: true,
            },
            {
                title: "Deadline",
                dataIndex: "predictionDeadline",
                key: "predictionDeadline",
                render: (d) => (d ? dayjs(d).format("MMM DD, YYYY h:mm A") : ""),
            },
            {
                title: "Action",
                key: "action",
                align: "center",
                render: (_, record) => (
                    <Space size="middle" className="justify-center items-center flex">
                        <Tooltip title="View">
                            <Link
                                to={`/add-score-prediction/${record._id}`}
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
                            title="Delete this sport?"
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
        [handleEdit, handleDelete]
    );


    return (
        <section className="py-5 px-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Sport Management</h2>
                <button
                    className="bg-[#704AAA] py-3 px-8 rounded-lg text-white"
                    onClick={handleAddNew}
                >
                    Add New Sport
                </button>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#704AAA",
                            headerColor: "#fff",
                            headerBorderRadius: 5,
                        },
                    },
                }}
            >
                <Table
                    loading={isLoading}
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
            >
                <Form form={form} layout="vertical">
                    <div className="my-10">
                        <h2 className="text-3xl font-semibold mb-3">
                            {mode === "add" ? "Add New Sport" : "Edit Sport"}
                        </h2>
                        <p className="text-xl">
                            {mode === "add"
                                ? "Enter the Sport details below to add it."
                                : "Update the Sport information below."}
                        </p>
                    </div>

                    <Form.Item
                        label="Upload Sport Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        rules={[{ required: true, message: "Please upload an image" }]}
                    >
                        {

                        }
                        <Upload listType="picture-card" beforeUpload={() => false} accept="image/*" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Sport Title"
                        name="sportTitle"
                        rules={[{ required: true, message: "Please enter sport title" }]}
                    >
                        <Input className="!h-12" placeholder="Enter Sport Title" />
                    </Form.Item>

                    <Form.Item
                        label="Sport Description"
                        name="sportDescription"
                        rules={[{ required: true, message: "Please enter sport description" }]}
                    >
                        <TextArea rows={4} placeholder="Enter Sport Description" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="First Team Name"
                            name="firstTeamName"
                            rules={[{ required: true, message: "Enter First team Name" }]}
                        >
                            <Input className="!h-12" placeholder="Enter First Team Name" />
                        </Form.Item>

                        <Form.Item
                            label="Second Team Name"
                            name="secondTeamName"
                            rules={[{ required: true, message: "Enter Second team Name" }]}
                        >
                            <Input className="!h-12" placeholder="Enter Second Team Name" />
                        </Form.Item>

                        <Form.Item
                            label="Sponsor Name"
                            name="sponsorName"
                            rules={[{ required: true, message: "Enter Sponsor Name" }]}
                        >
                            <Input className="!h-12" placeholder="Enter Sponsor Name" />
                        </Form.Item>

                        <Form.Item
                            label="Sponsor Link"
                            name="sponsorLink"
                            rules={[{ required: true, message: "Enter Sponsor Link" }]}
                        >
                            <Input className="!h-12" placeholder="Enter Sponsor Link" />
                        </Form.Item>

                    </div>

                    <Form.Item
                        label="Prediction Deadline"
                        name="predictionDeadline"
                        rules={[{ required: true, message: "Select Deadline time" }]}
                    >
                        <DatePicker
                            className="!h-12"
                            style={{ width: "100%" }}
                            showTime
                            placeholder="Select Deadline time"
                            disabledDate={(current) => current && current < moment().startOf("day")}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </section>
    );
};

export default AddScorePrediction;
