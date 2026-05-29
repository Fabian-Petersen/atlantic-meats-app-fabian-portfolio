import { Skeleton } from "@/components/ui/skeleton";

export function JobRequestsChartSkeleton() {
  // 12 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Stable heights (deterministic)
  const barHeights = [80, 120, 100, 140, 90, 130, 110, 150, 95, 125, 105, 135];

  return (
    <div className="h-full w-full flex flex-col justify-end gap-2 p-4">
      {/* Bars */}
      <div className="flex-1 flex items-end gap-2 bg-gray-100 dark:bg-(--bg-primary_dark) max-w-full">
        {months.map((month, i) => (
          <div
            key={month}
            className="flex flex-col items-center gap-1 overflow-hidden"
          >
            {/* Bar skeleton */}
            <Skeleton
              className="w-full"
              style={{ height: `${barHeights[i]}px` }}
            />
            {/* X-axis label skeleton */}
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
