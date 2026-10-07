import type { ChartPoint } from "@/schemas/dashboardSchema";
import { cn } from "@/lib/utils";

type Props = {
  data: ChartPoint[];
  isMobile: boolean;
  onSelect: (point: ChartPoint) => void;
  compactMobileLeft?: boolean;
};

const getPointLabel = (point: ChartPoint, isMobile: boolean) =>
  isMobile ? (point.code ?? point.name) : point.name;

export default function DashboardBarChart({
  data,
  isMobile,
  onSelect,
  compactMobileLeft = false,
}: Props) {
  const values = data.map((point) => Number(point.value) || 0);
  const maxValue = Math.max(...values, 1);

  return (
    <div
      className={cn(
        "grid h-full min-h-0 w-full grid-cols-[2.25rem_minmax(0,1fr)] gap-2 px-1 py-2 md:grid-cols-[2.5rem_minmax(0,1fr)] md:px-4 md:py-3",
        compactMobileLeft &&
          "grid-cols-[1.75rem_minmax(0,1fr)] gap-1 px-0 md:grid-cols-[2.5rem_minmax(0,1fr)] md:gap-2 md:px-4",
      )}
    >
      <div
        className="flex flex-col justify-between pb-7 pt-10 text-right text-[0.625rem] text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        <span>{maxValue.toLocaleString()}</span>
        <span>{Math.round(maxValue / 2).toLocaleString()}</span>
        <span>0</span>
      </div>

      <div
        className={cn(
          "flex min-h-0 min-w-0 items-stretch gap-1 overflow-hidden border-b border-l border-gray-300 px-1 pt-10 dark:border-gray-600 md:gap-2 md:px-2",
          compactMobileLeft && "px-0 md:px-2",
        )}
      >
        {data.map((point, index) => {
          const value = values[index];
          const label = getPointLabel(point, isMobile);
          const height = value > 0 ? Math.max((value / maxValue) * 100, 2) : 0;
          const tooltipPosition =
            index === 0
              ? "left-0"
              : index === data.length - 1
                ? "right-0"
                : "left-1/2 -translate-x-1/2";

          return (
            <button
              key={`${point.name}-${index}`}
              type="button"
              className="group flex min-w-0 flex-1 flex-col justify-end outline-none"
              onClick={() => onSelect(point)}
              title={`${point.name}: ${value.toLocaleString()}`}
              aria-label={`${point.name}: ${value.toLocaleString()}`}
            >
              <span className="flex min-h-0 flex-1 items-end justify-center">
                <span
                  className="relative w-full max-w-7 rounded-t-sm bg-(--clr-primary) transition-[filter] group-hover:brightness-95 group-focus-visible:ring-2 group-focus-visible:ring-blue-500 group-focus-visible:ring-offset-2"
                  style={{ height: `${height}%` }}
                >
                  <span
                    className={`pointer-events-none absolute -top-9 z-20 hidden max-w-40 whitespace-nowrap rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-950 shadow-md group-hover:block group-focus-visible:block dark:border-amber-400/30 dark:bg-gray-700 dark:text-amber-100 md:text-sm ${tooltipPosition}`}
                  >
                    <span className="capitalize">{label}</span>: {value.toLocaleString()}
                  </span>
                </span>
              </span>
              <span className="h-7 w-full truncate pt-1 text-center text-[0.625rem] capitalize text-gray-600 dark:text-gray-300 md:text-xs">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
