import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentTransactions from "../../component/Main/Dashboard/RecentTransactions";
import Status from "../../component/Main/Dashboard/Status";
import { useGetDashboardStatusQuery } from "../../redux/features/dashboard/dashboardApi";
const DashboardHome = () => {
  const { data } = useGetDashboardStatusQuery()

  const fullData = data?.data?.attributes

  console.log(fullData);


  return (
    <section>
      <h1 className="text-4xl font-semibold py-5 px-3">Dashboard </h1>
      <div className="px-3">
        <Status fullData={fullData} />
        <div className=" pt-10">
          <IncomeGraphChart fullData={fullData} />
          {/* <Piechart /> */}
        </div>
        <RecentTransactions fullData={fullData} />
      </div>
    </section>
  );
};

export default DashboardHome;
