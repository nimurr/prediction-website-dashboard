import { FaDatabase } from "react-icons/fa";
import { PiCurrencyCircleDollar, PiUsers, PiUsersThreeFill } from "react-icons/pi";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
const Status = ({ fullData }) => {


  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-5 bg-gradient-to-tr to-purple-400 rounded-lg from-white">
      <div className="flex items-center gap-5">
        <img className="max-w-32" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
        <div>
          <h2 className="text-4xl">Total Users</h2>
          <h3 className="text-3xl font-semibold text-[#704AAA]" >{fullData?.totalUsers || 0}</h3>
        </div>
      </div>
      <div className="lg:border-l-2 border-[#704AAA] lg:pl-3 flex items-center gap-5">
        <img src="/Home/active_prediction.png" alt="" />
        <div>
          <h2 className="text-4xl">Active Events</h2>
          <h3 className="text-3xl font-semibold text-[#704AAA]">{fullData?.totalEvents || 0}</h3>
        </div>
      </div>
    </div >
  );
};

export default Status;
