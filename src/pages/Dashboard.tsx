// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// // import ProjectSummaryTable from "../charts/ProjectSummaryTable";
// import TaskContainer from "../tasks/TasksContainer";
// import NotificationSidebar from "../notifications/NotificationBar";

// import Sidebar from "@/components/dashboardSidebar/Sidebar";
import OpenRequestsPieChart from "@/components/dashboard/charts/OpenRequestsPieChart";
import CardContainer from "../components/dashboard/CardContainer";
import JobRequestsChart from "@/components/dashboard/charts/JobRequestsChart";
import ChartHeading from "@/components/dashboard/ChartHeading";
import { getDashboardJobColumns } from "@/components/maintenanceRequestTable/columns";
import { useGetAll } from "@/utils/api";
import type { JobAPIResponse } from "@/schemas";
import { GenericTable } from "@/components/dashboard/GenericTable";

const Dashboard = () => {
  const columns = getDashboardJobColumns();
  const MAINTENANCE_REQUESTS_KEY = ["allMaintenanceRequests"];

  const { data } = useGetAll<JobAPIResponse[]>(
    "maintenance-requests-list",
    MAINTENANCE_REQUESTS_KEY,
  );
  // $ Only show the pending requests
  const pendingRequests = data?.filter(
    (item) => item.status === "Pending" || item.status === "pending",
  );

  return (
    <main className="w-full bg-gray-100 dark:bg-bgdark h-full md:p-4 p-2">
      {/* <NotificationSidebar /> */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-hidden h-auto px-2">
        {/* Cards */}
        <section className="col-span-2 lg:col-span-3 xl:col-span-4 dark:border-gray-700/50">
          <CardContainer />
        </section>

        {/* Revenue & Expense Chart */}

        <section
          className="flex flex-col gap-4 col-span-2 xl:col-span-3 h-[300px] rounded-md bg-white dark:bg-[#1d2739]
          border border-white dark:border-gray-700/50 p-2 shadow-sm
            text-gray-600 dark:text-gray-100"
        >
          <ChartHeading
            title="Job Requests YTD"
            className="font-normal text-black"
          />
          <JobRequestsChart />
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
          flex flex-col gap-4
            col-span-full lg:col-span-full xl:col-span-full
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
          <ChartHeading title="Pending Requests" className="" />
          <GenericTable data={pendingRequests ?? []} columns={columns ?? []} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
