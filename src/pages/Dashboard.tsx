// import RevenueExpenseChart from "../charts/RevenueExpenseChart";
// import ProjectSummaryTable from "../charts/ProjectSummaryTable";
// import TaskContainer from "../tasks/TasksContainer";
// import NotificationSidebar from "../notifications/NotificationBar";

// import Sidebar from "@/components/dashboardSidebar/Sidebar";
import OpenRequestsPieChart from "@/components/dashboard/charts/OpenRequestsPieChart";
// import CostYTDChart from "@/components/dashboard/charts/CostYTDChart";
import ChartHeading from "@/components/dashboard/ChartHeading";
import { getDashboardJobColumns } from "@/components/maintenanceRequestTable/columns";
import { useGetAll } from "@/utils/api";
import type { JobAPIResponse } from "@/schemas";
import { TableGeneric } from "@/components/features/TableGeneric";
// import { Spinner } from "@/components/ui/spinner";
import { SkeletonTable } from "@/components/dashboard/SkeletonTable";
import { PieChartSkeleton } from "@/components/dashboard/charts/PieChartSkeleton";
import { JobRequestsChartSkeleton } from "@/components/dashboard/charts/JobRequestsChartSkeleton";
import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useDashboardJobsMetrics } from "@/hooks/useDashboardJobsMetrics";
// import Cards from "@/components/dashboard/Cards";
import CardContainer from "../components/dashboard/CardContainer";
import { useAllStoresCostByYear } from "@/hooks/useAllStoresCostByYear";
import CostChart from "@/components/dashboard/charts/CostChart";
import { useStoreCostByYear } from "@/hooks/useStoreCostByYear";

/* -------------------------------- Animation ------------------------------- */
import { motion } from "framer-motion";

const Dashboard = () => {
  const columns = getDashboardJobColumns();

  // 👇 State to track which store/year was selected from the main chart
  const [selectedStore, setSelectedStore] = useState<{
    year: string;
    location: string;
  } | null>(null);

  const isDrilldown = !!selectedStore;

  // $ Data passed to the table Pending Requests
  const { data: pendingRequests } = useGetAll<JobAPIResponse[]>({
    resourcePath: "api/jobs/requests",
    queryKey: ["jobs", "pending"],
    params: {
      status: "pending",
    },
  });

  // $ Hook pass the cards data to the CardContainer
  const { cards, isPending } = useDashboardJobsMetrics();

  // $ Hook pass the data to the CostChart Stores Cost per Month for selected year
  const { data: costByYear, isPending: isCostByYearPending } =
    useAllStoresCostByYear();

  const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
    useStoreCostByYear(
      selectedStore?.year ?? null,
      selectedStore?.location ?? null,
    );

  const chartData = isDrilldown
    ? (costPerStoreByYear?.data ?? {})
    : (costByYear ?? {});

  const isLoading = isDrilldown ? isCostPerStorePending : isCostByYearPending;

  // $ Use a key that changes when view changes
  // const viewKey = selectedStore
  //   ? `store-${selectedStore.year}-${selectedStore.location}`
  //   : "year";

  // console.log("costPerStoreByYear:", costPerStoreByYear);

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
          <CardContainer cards={cards} isPending={isPending} />
          {/* <Cards /> */}
        </section>
        {/* Revenue & Expense Chart */}
        <section
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-3 min-h-0 flex flex-col gap-4",
            "text-gray-600 dark:text-gray-100",
          )}
        >
          <motion.div
            layout
            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            className="flex flex-col gap-4 h-full"
          >
            {/* Header (participates in layout animation) */}
            <div className="flex items-center justify-between">
              <ChartHeading
                title={
                  isDrilldown
                    ? `${selectedStore.location} — Cost Breakdown ${selectedStore.year}`
                    : "Maintenance Cost YTD"
                }
                returnAction={isDrilldown}
                onClick={() => setSelectedStore(null)}
                className={cn(sharedStyles.chartHeading, "capitalize")}
              />
            </div>

            {/* Chart container (layout animated) */}
            <motion.div layout className="flex-1 min-h-0">
              {isLoading ? (
                <JobRequestsChartSkeleton />
              ) : (
                <CostChart
                  data={chartData}
                  onSelect={
                    isDrilldown
                      ? undefined
                      : (year, location) => {
                          setSelectedStore((prev) =>
                            prev?.year === year && prev?.location === location
                              ? null
                              : { year, location },
                          );
                        }
                  }
                />
              )}
            </motion.div>
          </motion.div>
        </section>
        {/* 
        <section
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-3 min-h-0 flex flex-col gap-4",
            "text-gray-600 dark:text-gray-100",
          )}
        >
          {/* <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4 h-full"
          >
            {isLoading ? (
              <JobRequestsChartSkeleton />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <ChartHeading
                    title={
                      isDrilldown ? (
                        <div className="flex items-center gap-4">
                          <button
                            aria-label="return to dashboard"
                            type="button"
                            onClick={() => setSelectedStore(null)}
                            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
                          >
                            <ChevronLeft />
                          </button>
                          <span>
                            {selectedStore.location} — Cost Breakdown {""}
                            {selectedStore.year}
                          </span>
                        </div>
                      ) : (
                        "Maintenance Cost YTD"
                      )
                    }
                    className={cn(sharedStyles.chartHeading, "capitalize")}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <CostChart
                    data={chartData}
                    onSelect={
                      isDrilldown
                        ? undefined
                        : (year, location) => {
                            setSelectedStore((prev) =>
                              prev?.year === year && prev?.location === location
                                ? null
                                : { year, location },
                            );
                          }
                    }
                  />
                </div>
              </>
            )}
          </motion.div>
          {/* </AnimatePresence>
        </section>
        */}
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
