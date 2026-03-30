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
    <div className="h-[300px] w-full flex flex-col justify-end gap-2 p-4">
      {/* Bars */}
      <div className="flex-1 flex items-end gap-2">
        {months.map((month, i) => (
          <div key={month} className="flex flex-col items-center gap-1 w-full">
            {/* Bar skeleton */}
            <Skeleton
              className="w-full rounded-sm"
              style={{ height: `${barHeights[i]}px` }}
            />
            {/* X-axis label skeleton */}
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>

      {/* Y-axis label placeholders */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-6" />
        ))}
      </div>
    </div>
  );
}
