// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// import ProjectSummaryTable from "../charts/ProjectSummaryTable";
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
// import { Spinner } from "@/components/ui/spinner";
import { SkeletonTable } from "@/components/dashboard/SkeletonTable";
import { PieChartSkeleton } from "@/components/dashboard/charts/PieChartSkeleton";
import { JobRequestsChartSkeleton } from "@/components/dashboard/charts/JobRequestsChartSkeleton";
import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect } from "react";

const Dashboard = () => {
  const columns = getDashboardJobColumns();
  const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests", "pending"];

  const { data: pendingRequests, isPending } = useGetAll<JobAPIResponse[]>({
    resourcePath: "jobs-list-pending",
    queryKey: MAINTENANCE_REQUESTS_KEY,
  });

  useEffect(() => {
    const loadGroups = async () => {
      const groups = await getUserGroups();
      console.log(groups);
    };
    loadGroups();
  }, []);

  return (
    <main className="w-full bg-gray-100 dark:bg-bgdark h-full md:p-4 p-2">
      {/* <NotificationSidebar /> */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-hidden h-auto px-2">
        {/* $ Cards */}
        <section className="col-span-2 lg:col-span-3 xl:col-span-4 dark:border-gray-700/50">
          <CardContainer />
        </section>
        {/* Revenue & Expense Chart */}
        <section
          className="flex flex-col gap-4 col-span-2 xl:col-span-3 h-[300px] rounded-md bg-white dark:bg-(--bg-primary_dark)
          border border-white dark:border-gray-700/50 p-2 shadow-sm
            text-gray-600 dark:text-gray-100"
        >
          {isPending ? (
            <JobRequestsChartSkeleton />
          ) : (
            <>
              <ChartHeading
                title="Job Requests YTD"
                className="font-normal dark:text-(--clr-textDark) text-(--clr-textLight)"
              />
              <JobRequestsChart />
            </>
          )}
        </section>
        <section
          className="col-span-2 xl:col-span-1 h-[300px] rounded-md bg-white dark:bg-(--bg-primary_dark)
          border border-white dark:border-gray-700/50 p-2 shadow-sm 
            dark:text-(--clr-textDark) text-(--clr-textLight)"
        >
          {isPending ? <PieChartSkeleton /> : <OpenRequestsPieChart />}
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
            bg-white dark:bg-(--bg-primary_dark)
            border border-white dark:border-gray-700/50
            p-4
            shadow-sm
          "
        >
          <ChartHeading
            title="Pending Requests"
            className="dark:text-(--clr-textDark) text-(--clr-textLight)"
          />
          {isPending ? (
            <div className="grid col-span-full place-items-center">
              <SkeletonTable />
            </div>
          ) : (
            <GenericTable
              data={pendingRequests ?? []}
              columns={columns ?? []}
              initialSorting={[{ id: "jobCreated", desc: true }]}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
