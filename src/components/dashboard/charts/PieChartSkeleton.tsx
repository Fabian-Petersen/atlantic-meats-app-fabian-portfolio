import { Skeleton } from "@/components/ui/skeleton";

export function PieChartSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full absolute top-5 left-0"
      style={{ width: "100%", height: 300 }}
    >
      {/* Chart Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer circle */}
        <Skeleton className="h-54 w-54 rounded-full" />

        {/* Inner cutout (donut effect) */}
        <div className="absolute h-36 w-36 rounded-full bg-background" />

        {/* Center text */}
        <div className="absolute flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}
