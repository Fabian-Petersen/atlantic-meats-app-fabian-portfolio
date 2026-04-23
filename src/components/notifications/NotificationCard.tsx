import { MapPin, Calendar, NotebookPen } from "lucide-react";
import type { JobAPIResponse } from "@/schemas";
import { useNavigate } from "react-router-dom";
import { Badge } from "../features/Badge";
import { priorityStyles } from "@/styles/priorityStyles";
import { CardRow } from "../mobile/CardRow";
type MaintenanceRequestCardProps = {
  row: JobAPIResponse;
};

export default function NotificationCard({ row }: MaintenanceRequestCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border border-gray-200 dark:border-(--clr-borderDark) bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm">
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className="hover:cursor-pointer w-full text-left px-4 py-3 flex flex-col hover:bg-gray-50 dark:hover:bg-white/5 transition-colors space-y-2"
        onClick={() => navigate(`/jobs/${row.id}/pending`)}
      >
        {/* Location + meta row */}
        <div className="flex justify-between min-w-0">
          <CardRow
            icon={MapPin}
            value={row?.location}
            valueStyles="text-sm dark:text-white"
            iconStyles="dark:text-green-500 text-green-500"
            className="py-0"
          />
          <CardRow className="py-0">
            <Badge value={row?.priority} styleMap={priorityStyles} />
          </CardRow>
        </div>
        <CardRow icon={Calendar} value={row?.jobCreated} className="py-0" />
        {/* Description */}
        {row.jobComments && (
          <CardRow
            value={row.jobComments}
            icon={NotebookPen}
            className="w-full py-0"
          />
        )}
      </button>
    </div>
  );
}
