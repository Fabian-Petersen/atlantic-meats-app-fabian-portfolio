import { MapPin, Calendar, Wrench, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobAPIResponse } from "@/schemas";
import { useNavigate } from "react-router-dom";
// import { usePOST } from "@/utils/api";
// import { toast } from "sonner";
// import useGlobalContext from "@/context/useGlobalContext";
// import { toast } from "sonner";
import { priorityConfig } from "@/lib/priorityConfig";

type MaintenanceRequestCardProps = {
  row: JobAPIResponse;
};

export default function NotificationCard({ row }: MaintenanceRequestCardProps) {
  const priority =
    priorityConfig[row.priority?.toLowerCase()] ?? priorityConfig.low;

  const navigate = useNavigate();

  //   const {} = useGlobalContext();

  return (
    <div className="rounded-md border border-gray-200 dark:border-(--clr-borderDark) bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm">
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className="hover:cursor-pointer w-full text-left px-4 py-3 flex flex-col gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={() => navigate(`/jobs-list-pending/${row.id}`)}
      >
        {/* Location + meta row */}
        <div className="flex justify-between min-w-0">
          <div className="flex flex-col gap-1.5 mb-1">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {row.location}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-100 truncate">
                {row.jobCreated}
              </p>
            </div>
          </div>
          {/* Priority badge */}
          <Badge
            className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${priority.className}`}
          >
            {priority.label}
          </Badge>
        </div>

        {/* Equipment + Asset ID */}
        <div className="flex items-start gap-2">
          <Wrench className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 flex items-center justify-between gap-2">
            <span className="text-sm text-gray-800 dark:text-gray-200 capitalize font-medium">
              {row.equipment}
            </span>
            <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
              #{row.assetID}
            </span>
          </div>
        </div>

        {/* Description */}
        {row.jobComments && (
          <div className="flex items-start gap-2">
            <NotebookPen className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
              {row.jobComments}
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
