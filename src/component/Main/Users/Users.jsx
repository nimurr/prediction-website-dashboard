import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";


const { Item } = Form;

// ✅ Demo Users (Fallback)
const demoUsers = [
  {
    id: "demo1",
    fullName: "John Doe",
    accountID: "ACC001",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address_line1: "123 Main St",
    createdAt: "2024-01-15T10:00:00Z",
    status: "Active",
    gender: "Male",
  },
  {
    id: "demo2",
    fullName: "Jane Smith",
    accountID: "ACC002",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    address_line1: "456 Park Ave",
    createdAt: "2024-02-20T15:30:00Z",
    status: "Active",
    gender: "Female",
  },
  {
    id: "demo3",
    fullName: "Michael Johnson",
    accountID: "ACC003",
    email: "michael.johnson@example.com",
    phoneNumber: "555-123-4567",
    address_line1: "789 Broadway",
    createdAt: "2024-03-10T08:15:00Z",
    status: "Inactive",
    gender: "Male",
  },
];

const Users = () => {
  const { data, isFetching } = useGetAllUsersQuery();

  console.log(data);

  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);

  // Use API data or fallback demo data
  const allUsers =
    data?.data?.attributes?.results?.length > 0
      ? data.data.attributes?.results
      : demoUsers;

  // Format user data for table
  useEffect(() => {
    if (allUsers) {
      const formattedUsers = allUsers.map((user, index) => ({
        id: user.id || user._id,
        si: index + 1,
        fullName: user.fullName,
        accountID: user.accountID,
        email: user.email,
        phoneNumber: user.phoneNumber || "-----",
        address_line1: user.address_line1,
        createdAt: user.createdAt,
        status: user.status,
        gender: user.gender,
      }));
      setDataSource(formattedUsers);
    }
  }, [allUsers]);

  // Search Filter
  useEffect(() => {
    if (searchText.trim() === "") {
      setDataSource(allUsers || []);
    } else {
      setDataSource(
        allUsers?.filter(
          (user) =>
            user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            String(user.phoneNumber)?.includes(searchText)
        ) || []
      );
    }
  }, [searchText, allUsers]);

  // Date Filter
  useEffect(() => {
    if (!selectedDate) {
      setDataSource(allUsers || []);
    } else {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setDataSource(
        allUsers?.filter(
          (user) =>
            moment(user.createdAt).format("YYYY-MM-DD") === formattedDate
        ) || []
      );
    }
  }, [selectedDate, allUsers]);

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber",
      render: (text) => <span>{text || "------"}</span>
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/users/${record.id}`}>
          <GoInfo className="text-2xl" />
        </Link>
      ),
    },
  ];

  return (
    <section>
      <div className="md:flex justify-between items-center py-6 mb-4">
        <Link to={"/collaborator"} className="text-2xl flex items-center">
          <FaAngleLeft /> Users List
        </Link>
        <Form layout="inline" className="flex space-x-4">
          <Item name="date">
            <DatePicker
              className="rounded-md border border-[#92b8c0]"
              onChange={(date) => setSelectedDate(date)}
              placeholder="Select Date"
            />
          </Item>
          <Item name="username">
            <Input
              className="rounded-md w-[70%] md:w-full border border-[#92b8c0]"
              placeholder="User Name"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Item>
          <Item>
            <button className="size-8 rounded-full flex justify-center items-center bg-[#92b8c0] text-black">
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
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
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            onChange: setCurrentPage,
          }}
          scroll={{ x: "max-content" }}
          responsive={true}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={isFetching}
        />
      </ConfigProvider>
    </section>
  );
};

export default Users;
