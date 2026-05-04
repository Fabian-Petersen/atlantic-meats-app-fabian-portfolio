import { Skeleton } from "@/components/ui/skeleton";

export function PieChartSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 w-full h-full"
      style={{ width: "100%", height: 300 }}
    >
      {/* Chart Circle */}
      <div className="relative flex items-center justify-center ">
        {/* Outer circle */}
        <Skeleton className="h-54 w-54 rounded-full" />

        {/* Inner cutout (donut effect) */}
        <div className="absolute h-20 w-20 rounded-full bg-background" />

        {/* Center text */}
        <div className="absolute flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      {/* Legend */}
      {/* <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-sm" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div> */}
    </div>
  );
}
