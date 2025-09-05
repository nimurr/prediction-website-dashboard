import {
  ConfigProvider,
  Table,
  Pagination,
  Space,
  message,
  Modal,
} from "antd";
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
import {
  useBlockUserMutation,
  useUnBlockUserMutation,
} from "../../../redux/features/user/userApi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import moment from "moment";

// ✅ Demo user list (fallback)
const demoUsers = [
  {
    id: "demo1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    createdAt: "2024-01-15, 10:00 AM",
  },
  {
    id: "demo2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    createdAt: "2024-02-10, 09:15 AM",
  },
  {
    id: "demo3",
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "Moderator",
    createdAt: "2024-03-05, 02:30 PM",
  },
  {
    id: "demo4",
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    createdAt: "2024-04-22, 06:45 PM",
  },
  {
    id: "demo5",
    fullName: "David Wilson",
    email: "david.wilson@example.com",
    role: "User",
    createdAt: "2024-05-30, 11:20 AM",
  },
];

const RecentTransactions = ({ fullData }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: userData, isLoading } = useGetDashboardStatusQuery();
  const recentUsers = userData?.recentUsers?.length
    ? userData.recentUsers
    : demoUsers;


  console.log(fullData?.recentUsers);

  const [userBlock] = useBlockUserMutation();
  const [userUnBlock] = useUnBlockUserMutation();

  // Block user
  const handleUserRemove = async (id) => {
    try {
      const res = await userBlock(id);
      if (res.error) {
        message.error(res.error.data.message);
      }
      if (res.data) {
        message.success(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Unblock user
  const handleUserUnBlock = async (id) => {
    try {
      const res = await userUnBlock(id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Show user details in modal
  const viewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      title: "#SL",
      dataIndex: "si",
      key: "si",
      align: "center",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" className="flex flex-row justify-center">
          <button onClick={() => viewDetails(record)}>
            <FaRegUserCircle className="text-2xl text-[#704AAA]" />
          </button>
          <button>
            {/* <MdOutlineBlock className="text-2xl text-[#704AAA]" /> */}
          </button>
        </Space>
      ),
    },
  ];

  const filteredData = fullData?.recentUsers?.filter((user) => {
    const matchesText = user.fullName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDate = selectedDate
      ? user.createdAt.split(",")[0] === selectedDate.format("YYYY-MM-DD")
      : true;

    return matchesText && matchesDate;
  });

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const dataSource = paginatedData?.map((user, index) => ({
    key: user.id,
    si: (currentPage - 1) * pageSize + index + 1,
    userName: user.fullName,
    email: user.email,
    role: user.role,
    joinDate: moment(user.createdAt).format("DD-MM-YYYY"),
  }));

  return (
    <div className="w-full col-span-full md:col-span-6 bg-white rounded-lg">
      <div className="flex items-center justify-between flex-wrap my-10">
        <h1 className="text-2xl flex items-center">Recent Users</h1>
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
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 500 }}
          className="text-center"
        />
      </ConfigProvider>

      <div className="flex justify-center my-10">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData?.length}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          pageSizeOptions={[6, 10, 20, 50]}
        />
      </div>

      <Modal open={isModalVisible} onCancel={handleCancel} footer={[]}>
        {selectedUser && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-10">
              User Details
            </h2>
            <p className="flex items-center justify-between my-5">
              <strong>Name:</strong> {selectedUser.userName}
            </p>
            <p className="flex items-center justify-between my-5">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="flex items-center justify-between my-5">
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p className="flex items-center justify-between my-5">
              <strong>Join Date:</strong> {selectedUser.joinDate}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecentTransactions;
