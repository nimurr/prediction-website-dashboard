import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetAllNotificationQuery, useUpdateNotificationMutation } from "../../../redux/features/setting/settingApi";
import moment from "moment";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: allNotification } = useGetAllNotificationQuery();
  const notificationData = allNotification?.data;
  console.log(notificationData);

  const [notifications, setNotifications] = useState([]);

  // ---- Load API notifications ----
  useEffect(() => {
    if (Array.isArray(notificationData) && notificationData.length) {
      const normalized = notificationData.map((n, idx) => ({
        id: n._id ?? `api-${idx}`,
        title: n.title ?? "Notification",
        message: n.content ?? "",
        status: n.status ?? "unread", // backend field
        createdAt: n.createdAt ?? new Date().toISOString(),
      }));
      setNotifications(normalized);
    } else {
      setNotifications([]); // no demo fallback needed in prod
    }
    setCurrentPage(1);
  }, [notificationData]);

  // ---- Pagination ----
  const paginated = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => setCurrentPage(page);

  // ---- Toggle read/unread (local only) ----
  const [updateNotification] = useUpdateNotificationMutation();
  const toggleRead = async (id) => {
    console.log(id);
    try {
      const res = await updateNotification(id);
      console.log(res);
      if (res?.data?.success == true) {
        const updated = notifications.map((n) =>
          n.id === id ? { ...n, status: "read" } : n
        );
        setNotifications(updated);
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4">
        <FaAngleLeft /> Notification
      </Link>

      <div className="space-y-4">
        {paginated.map((item) => {
          const isUnread = item.status === "unread";
          return (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`border rounded-md p-4 flex items-center space-x-4 cursor-pointer transition
                ${isUnread
                  ? "border-[#704AAA] hover:bg-[#7f55bd88]"
                  : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <div
                className={`relative rounded-full p-2 ${isUnread
                  ? "text-[#704AAA] border border-[#704AAA]"
                  : "text-gray-400 border border-gray-300"
                  }`}
              >
                {isUnread && (
                  <span className="bg-[#704AAA] w-2 h-2 rounded-full absolute -top-1 -right-1" />
                )}
                <IoMdNotificationsOutline size={30} />
              </div>

              <div>
                <p className={`font-semibold ${isUnread ? "" : "text-gray-600"}`}>
                  {item.title}
                </p>
                <p className="text-gray-500">{item.message}</p>
                <p className="text-gray-400 text-sm">
                  {moment(item.createdAt).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          total={notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;