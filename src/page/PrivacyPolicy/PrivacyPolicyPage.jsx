import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useGetPrivacyPolicyQuery } from "../../redux/features/setting/settingApi";
import { useEffect } from "react";

const PrivacyPolicyPage = () => {
  const { data: privacyPolicy, isLoading, refetch } = useGetPrivacyPolicyQuery();
  const htmlContent = privacyPolicy?.data?.content;

  // Decode HTML entities
  const decodeHtmlEntities = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <Link to="/settings" className="flex gap-4 items-center">
          <IoChevronBack className="text-2xl" />
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </Link>
        <Link to={'/settings/edit-privacy-policy'}>
          <button className="bg-[#4C1D95] text-white flex items-center gap-2 p-2 rounded-md font-bold">
            <TbEdit className="size-5" />
            <span>Edit</span>
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div
          className="w-full h-full ml-3"
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(htmlContent) }}
        />
      )}
    </section>
  );
};

export default PrivacyPolicyPage;
