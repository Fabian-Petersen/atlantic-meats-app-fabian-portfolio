import { useEffect } from "react";
import { sharedStyles } from "@/styles/shared";

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import CardContainer from "../components/dashboard/CardContainer";
import ChartHeading from "@/components/dashboard/ChartHeading";
import MaintenanceCost from "@/components/dashboard/components/MaintenanceCost";
import { SkeletonTable } from "@/components/dashboard/SkeletonTable";
import { TableGeneric } from "@/components/features/TableGeneric";

/* -------------------------------------------------------------------------- */
/*                                Hooks & Utils                               */
/* -------------------------------------------------------------------------- */
import { getDashboardJobColumns } from "@/components/maintenanceRequestTable/columns";
import { getUserGroups } from "@/auth/getUserGroups";
import { useGetAll } from "@/utils/api";
import { cn } from "@/lib/utils";
import { useDashboardJobsMetrics } from "@/hooks/useDashboardJobsMetrics";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
import type { DashboardMetrics } from "@/schemas/dashboardSchema";
import type { JobAPIResponse } from "@/schemas";

/* -------------------------------------------------------------------------- */
/*                                  Animation                                 */
/* -------------------------------------------------------------------------- */
// import { motion } from "framer-motion";
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

  const isAdmin = metrics?.user.role === "admin";
  const userLocation = metrics?.user.location;

  // $ Hook combine backend and frontend data to generate a card
  const cards = useDashboardJobsMetrics(metrics?.cards);

  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  console.log(metrics);

  return (
    <main className="w-full h-full md:p-4 p-2">
      {/* <NotificationSidebar /> */}
      <div className={cn(sharedStyles.dashboard)}>
        {/* $ Cards */}
        <section className={cn(sharedStyles.dashboardCardsParent)}>
          <CardContainer cards={cards ?? []} isPending={isPending} />
        </section>
        {/* Revenue & Expense Chart Component */}
        <MaintenanceCost
          data={metrics?.storeCost ?? {}}
          isPending={isPending}
          isAdmin={isAdmin}
          userLocation={userLocation}
        />
        {/* Asset Verification Pie Chart Component */}
        <VerificationStatus
          data={metrics?.verification}
          isPending={isPending}
        />
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
