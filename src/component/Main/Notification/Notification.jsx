import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetAllNotificationQuery } from "../../../redux/features/setting/settingApi";
import moment from "moment";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: allNotification } = useGetAllNotificationQuery();

  const [notifications, setNotifications] = useState([]);

  // ---- Demo generator (fallback) ----
  const makeDemoNotifications = (count = 35) => {
    const demoMessages = [
      "Your prediction was approved.",
      "New match added: Real Madrid vs Barcelona.",
      "Payout sent to your Bitcoin address.",
      "Reminder: Submit prediction before deadline.",
      "You won! Claim your prize.",
      "Your account settings were updated.",
      "New comment on your prediction.",
    ];
    return Array.from({ length: count }).map((_, i) => {
      // spread times over minutes/hours/days
      const mins = (i + 1) * 17; // 17-minute gaps
      const createdAt = moment().subtract(mins, "minutes").toISOString();
      return {
        id: `demo-${i + 1}`,
        message: demoMessages[i % demoMessages.length],
        createdAt,
        read: i > 3, // first few are unread
      };
    });
  };

  // ---- Load API or fallback to demo ----
  useEffect(() => {
    const apiList = allNotification?.notifications;
    if (Array.isArray(apiList) && apiList.length) {
      // ensure "read" flag exists
      const normalized = apiList.map((n, idx) => ({
        id: n.id ?? `api-${idx}`,
        message: n.message ?? "Notification",
        createdAt: n.createdAt ?? new Date().toISOString(),
        read: typeof n.read === "boolean" ? n.read : false,
      }));
      setNotifications(normalized);
    } else {
      setNotifications(makeDemoNotifications(37));
    }
    setCurrentPage(1);
  }, [allNotification]);

  // ---- Pagination ----
  const paginated = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => setCurrentPage(page);

  // ---- Toggle read/unread ----
  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4">
        <FaAngleLeft /> Notification
      </Link>

      <div className="space-y-4">
        {paginated.map((item) => {
          const isUnread = !item.read;
          return (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`border rounded-md p-4 flex items-center space-x-4 cursor-pointer transition
                ${
                  isUnread
                    ? "border-[#704AAA] hover:bg-[#7f55bd88]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <div
                className={`relative rounded-full p-2 ${
                  isUnread ? "text-[#704AAA] border border-[#704AAA]" : "text-gray-400 border border-gray-300"
                }`}
              >
                {isUnread && (
                  <span className="bg-[#704AAA] w-2 h-2 rounded-full absolute -top-1 -right-1" />
                )}
                <IoMdNotificationsOutline size={30} />
              </div>

              <div>
                <p className={`font-semibold ${isUnread ? "" : "text-gray-600"}`}>
                  {item.message}
                </p>
                <p className="text-gray-500">
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
