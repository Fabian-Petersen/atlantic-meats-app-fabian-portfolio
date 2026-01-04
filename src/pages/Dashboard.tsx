// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// // import ProjectSummaryTable from "../charts/ProjectSummaryTable";
// import TaskContainer from "../tasks/TasksContainer";
// import NotificationSidebar from "../notifications/NotificationBar";

// import Sidebar from "@/components/dashboardSidebar/Sidebar";
import OpenRequestsPieChart from "@/components/dashboard/charts/OpenRequestsPieChart";
import CardContainer from "../components/dashboard/CardContainer";
import MaintenanceRequestsChart from "@/components/dashboard/charts/MaintenanceRequestsChart";
import ChartHeading from "@/components/dashboard/ChartHeading";

const Dashboard = () => {
  return (
    <main className="w-full bg-gray-100 dark:bg-bgdark h-full py-2">
      {/* <NotificationSidebar /> */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-hidden h-auto px-2">
        {/* Cards */}
        <section className="col-span-2 lg:col-span-3 xl:col-span-4 dark:border-gray-700/50">
          <CardContainer />
        </section>

        {/* Revenue & Expense Chart */}

        <section
          className="col-span-2 xl:col-span-3 h-[300px] rounded-md bg-white dark:bg-[#1d2739]
          border border-white dark:border-gray-700/50 p-2 shadow-sm
            text-gray-600 dark:text-gray-100"
        >
          <MaintenanceRequestsChart />
        </section>
        <section
          className="col-span-2 xl:col-span-1 h-[300px] rounded-md bg-white dark:bg-dark_bg
          border border-white dark:border-gray-700/50 p-2 shadow-sm 
            text-white dark:text-gray-100"
        >
          <OpenRequestsPieChart />
        </section>

        <div
          className="
            col-span-2 lg:col-span-2 xl:col-span-3
            self-start
            w-full min-w-0
            h-full
            overflow-y-auto
            rounded-md
            bg-white dark:bg-[#1d2739]
            border border-white dark:border-gray-700/50
            p-4
            shadow-sm
          "
        >
          <div
            className="h-54 rounded-md bg-white dark:bg-[#1d2739]
          border border-white dark:border-gray-700/50 p-2 shadow-sm
            text-gray-600 dark:text-gray-100"
          >
            <ChartHeading title="Placeholder" />
          </div>
          {/* <ProjectSummaryTable /> */}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
