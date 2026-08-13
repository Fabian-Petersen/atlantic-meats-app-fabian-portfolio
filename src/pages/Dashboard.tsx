import ChartHeading from "@/components/dashboard/ChartHeading";
import { getDashboardJobColumns } from "@/components/maintenanceRequestTable/columns";
import { useGetAll } from "@/utils/api";
import type { JobAPIResponse } from "@/schemas";
import { TableGeneric } from "@/components/features/TableGeneric";
import { SkeletonTable } from "@/components/dashboard/SkeletonTable";
import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
// import { useDashboardJobsMetrics } from "@/hooks/useDashboardJobsMetrics";
import CardContainer from "../components/dashboard/CardContainer";
import type { DashboardMetrics } from "@/schemas/dashboardSchema";

/* -------------------------------- Animation ------------------------------- */
// import { motion } from "framer-motion";
// import MaintenanceCost from "@/components/dashboard/components/MaintenanceCost";
import VerificationStatus from "@/components/dashboard/components/VerificationStatus";
// import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

const Dashboard = () => {
  const columns = getDashboardJobColumns();

  // $ Data passed to the table Pending Requests
  const { data: pendingRequests } = useGetAll<JobAPIResponse[]>({
    resourcePath: "api/jobs/requests",
    queryKey: ["jobs", "pending"],
    params: {
      status: "pending",
    },
  });

  const { data: metrics, isPending } = useGetAll<DashboardMetrics>({
    resourcePath: "api/dashboard/metrics",
    queryKey: ["metrics", "all"],
  });

  console.log("metrics:", metrics);
  // $ Hook pass the cards data to the CardContainer
  // const { cards, isPending } = useDashboardJobsMetrics();

  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  return (
    <main className="w-full h-full md:p-4 p-2">
      {/* <NotificationSidebar /> */}
      <div className={cn(sharedStyles.dashboard)}>
        {/* $ Cards */}
        <section className={cn(sharedStyles.dashboardCardsParent)}>
          <CardContainer cards={metrics?.cards ?? []} isPending={isPending} />
        </section>
        {/* Revenue & Expense Chart Component */}
        {/* <MaintenanceCost /> */}
        {/* Asset Verification Pie Chart Component */}
        {/* <VerificationStatus
          isPending={isPending}
          data={metrics?.verification}
        /> */}
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
            <TableGeneric
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
