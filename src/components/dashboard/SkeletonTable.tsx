import { Skeleton } from "@/components/ui/skeleton";

type SkeletonTableProps = {
  columns?: number;
  rows?: number;
};

export function SkeletonTable({ columns = 5, rows = 6 }: SkeletonTableProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-4 w-3/4" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t dark:border-gray-700/50">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
