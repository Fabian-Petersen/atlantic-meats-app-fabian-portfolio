// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// import ProjectSummaryTable from "../charts/ProjectSummaryTable";
// import TaskContainer from "../tasks/TasksContainer";
// import NotificationSidebar from "../notifications/NotificationBar";

// import Sidebar from "@/components/dashboardSidebar/Sidebar";
import OpenRequestsPieChart from "@/components/dashboard/charts/OpenRequestsPieChart";
import CardContainer from "../components/dashboard/CardContainer";
import CostYTDChart from "@/components/dashboard/charts/CostYTDChart";
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
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const Dashboard = () => {
  const columns = getDashboardJobColumns();

  const { data: pendingRequests, isPending } = useGetAll<JobAPIResponse[]>({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "pending"],
    params: {
      status: "pending",
    },
  });

  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  return (
    <main className="w-full h-full md:p-4 p-2">
      {/* <NotificationSidebar /> */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 overflow-x-hidden h-auto px-2">
        {/* $ Cards */}
        <section className="col-span-2 lg:col-span-3 xl:col-span-4 dark:border-gray-700/50">
          <CardContainer />
        </section>
        {/* Revenue & Expense Chart */}
        <section
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-3 min-h-0 flex flex-col gap-4",
            "text-gray-600 dark:text-gray-100",
          )}
        >
          {isPending ? (
            <JobRequestsChartSkeleton />
          ) : (
            <>
              <ChartHeading
                title="Maintenance Cost YTD"
                className={cn(sharedStyles.chartHeading)}
              />
              <div className="flex-1 min-h-0">
                <CostYTDChart />
              </div>
            </>
          )}
        </section>
        {/* Pie Chart */}
        <section
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-1",
            "dark:text-(--clr-textDark) text-(--clr-textLight)",
          )}
        >
          {isPending ? (
            <PieChartSkeleton />
          ) : (
            <>
              <ChartHeading
                title="Requests Review"
                className={cn(sharedStyles.chartHeading)}
              />
              <OpenRequestsPieChart />
            </>
          )}
        </section>
        {/* Pending Requests Table */}
        <section className={cn(sharedStyles.chartTable)}>
          <ChartHeading
            title="Pending Requests"
            className={cn(sharedStyles.chartHeading)}
          />
          {isPending ? (
            <div className="grid col-span-full place-items-center">
              <SkeletonTable />
            </div>
          ) : (
            <GenericTable
              data={pendingRequests ?? []}
              columns={columns ?? []}
              rowPath="jobs"
              action="pending-approval"
              initialSorting={[{ id: "jobCreated", desc: true }]}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
