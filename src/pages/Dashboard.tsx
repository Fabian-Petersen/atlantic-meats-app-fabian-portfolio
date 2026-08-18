import { useEffect } from "react";
import { sharedStyles } from "@/styles/shared";

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import CardContainer from "../components/dashboard/CardContainer";
import MaintenanceCost from "@/components/dashboard/components/MaintenanceCost";

/* -------------------------------------------------------------------------- */
/*                                Hooks & Utils                               */
/* -------------------------------------------------------------------------- */
import { getUserGroups } from "@/auth/getUserGroups";
import { useGetAll } from "@/utils/api";
import { cn } from "@/lib/utils";
import { useDashboardJobsMetrics } from "@/hooks/useDashboardJobsMetrics";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
import type {
  DashboardMetrics,
  StoreJobMetrics,
} from "@/schemas/dashboardSchema";

const emptyStoreJobMetrics: StoreJobMetrics = {
  pending: {},
  "in progress": {},
  complete: {},
  cancelled: {},
};

/* -------------------------------------------------------------------------- */
/*                                  Animation                                 */
/* -------------------------------------------------------------------------- */
import VerificationStatus from "@/components/dashboard/components/VerificationStatus";
import MaintenanceJobs from "@/components/dashboard/components/MaintenanceJobs";
// import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

const Dashboard = () => {
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
          <MaintenanceJobs
            data={metrics?.storeJobs ?? emptyStoreJobMetrics}
            isPending={isPending}
            isAdmin={isAdmin}
            userLocation={userLocation}
          />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
