/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";


// ✅ কাস্টম টুলটিপ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-50 rounded shadow-lg">
        <p className="label font-semibold">{` ${label}`}</p>
        <p className="intro">{`Total User This Day: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


const IncomeGraphChart = ({ fullData }) => {
  // ⚠️ "data" নাম কনফ্লিক্ট এড়াতে apiData ব্যবহার
  const apiData = fullData;
  console.log(apiData?.usersActivity);

  return (
    <section className="w-full col-span-full md:col-span-4 bg-white rounded-lg border border-[#704AAA]">
      <div className="border-b border-[#704AAA]">
        <div className="flex justify-between items-center p-3">
          <h1 className="font-semibold">User Activity </h1>

          {/* AntD Year Picker (readOnly feel) */}
          {/* <DatePicker picker="year" value={pickerYear} allowClear={false} /> */}
        </div>
      </div>



      <div className="px-2 pb-3">
        <ResponsiveContainer className="pr-4" width="100%" height={210}>
          <BarChart
            data={apiData?.usersActivity}
            margin={{ top: 5, bottom: 5 }}
            className="md:mt-5 md:mb-5"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" barSize={30} fill="#704AAA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default IncomeGraphChart;
