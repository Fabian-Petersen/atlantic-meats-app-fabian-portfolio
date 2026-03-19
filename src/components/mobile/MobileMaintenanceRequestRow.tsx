import { ChevronDown, MapPin, Calendar, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { usePOST } from "@/utils/api";
// import { toast } from "sonner";
import useGlobalContext from "@/context/useGlobalContext";
import { toast } from "sonner";

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
};

interface MaintenanceRequestCardProps {
  row: Row<JobAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMaintenanceRequestRow({
  row,
  isOpen,
  onToggle,
}: MaintenanceRequestCardProps) {
  const priority =
    priorityConfig[row.original.priority?.toLowerCase()] ??
    priorityConfig.medium;

  const navigate = useNavigate();
  const {
    selectedRowId,
    setSelectedRowId,
    setShowRejectRequestDialog,
    setShowApproveRequestDialog,
  } = useGlobalContext();

  const { mutateAsync: approveRequest, isPending } = usePOST({
    resourcePath: "job-request-approved",
    queryKey: ["maintenanceRequest"],
  });

  const handleSubmit = async () => {
    setShowApproveRequestDialog(true);
    const payload = {
      selectedRowId: selectedRowId,
      status: "In Progress",
    };

    try {
      await approveRequest(payload);
      // console.log("approve-request:", response);
      toast.success("The itemm was sucessfully rejected");
      navigate("/jobs-list-approved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-bgdark mb-2 overflow-hidden transition-shadow hover:shadow-sm">
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {/* Location + meta row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {row.original.location}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {row.original.jobCreated}
            </span>
          </div>
        </div>

        {/* Priority badge */}
        <Badge
          className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${priority.className}`}
        >
          {priority.label}
        </Badge>
      </button>

      {/* Expanded section */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* Equipment + Asset ID */}
          <div className="flex items-start gap-2">
            <Wrench className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-200 capitalize font-medium">
                {row.original.equipment}
              </span>
              <span className="text-xs text-gray-400 font-mono shrink-0">
                #{row.original.assetID}
              </span>
            </div>
          </div>

          {/* Description */}
          {row.original.jobComments && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
              {row.original.jobComments}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {/* View full details */}
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs-list-pending/${row.original.id}`);
                setSelectedRowId(row.original.id);
              }}
            >
              View details
            </button>

            {/* Reject */}
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowRejectRequestDialog(true);
                setSelectedRowId(row.original.id);
              }}
            >
              Reject
            </button>

            {/* Approve */}
            <button
              type="button"
              disabled={isPending}
              className="flex-1 py-2 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 hover:shadow-md text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// import type { JobAPIResponse } from "@/schemas";
// import { ChevronDown } from "lucide-react";
// import type { Row } from "@tanstack/react-table";
// import { useNavigate } from "react-router-dom";
// import useGlobalContext from "@/context/useGlobalContext";
// import { Badge } from "@/components/ui/badge";
// // import { Separator } from "../ui/separator";

// type Props = {
//   row: Row<JobAPIResponse>;
//   isOpen: boolean;
//   onToggle: () => void;
// };

// export function MobileMaintenanceRequestRow({ row, isOpen, onToggle }: Props) {
//   const navigate = useNavigate();
//   const { setShowDeleteDialog, setSelectedRowId } = useGlobalContext();

//   return (
//     <div
//       className="hover:cursor-pointer dark:border rounded-md p-3 mb-2 bg-white dark:bg-bgdark"
//       onClick={onToggle}
//     >
//       <div className="flex flex-col gap-2">
//         <div className="flex justify-between items-center dark:text-gray-200">
//           <p className="font-medium text-sm">{row.original.location}</p>
//           <ChevronDown
//             className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between items-center text-xs">
//             <p>Priority</p>
//             <Badge className="">{row.original.priority}</Badge>
//           </div>
//           <div className="flex justify-between text-xs items-center">
//             <span>Date Created</span>
//             <span>{row.original.jobCreated}</span>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="mt-3 text-sm grid gap-2">
//           <div className="flex gap-2 text-xs text-gray-500 w-full justify-between">
//             <span className="capitalize">{row.original.equipment}</span>
//             <span>{row.original.assetID}</span>
//             {/* <Separator /> */}
//           </div>
//           <div className="flex gap-2 text-sm my-2">
//             <span>{row.original.jobComments}</span>
//           </div>
//           <div className="w-full flex gap-12 justify-between mt-auto">
//             <button
//               type="button"
//               className="py-1 dark:text-gray-200 text-green-700 hover:cursor-pointer hover:text-green-700 bg-green-200/90 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 // console.log(row.original.id);
//                 navigate(`/maintenance-list/${row.original.id}`);
//                 setSelectedRowId(row.original.id);
//                 //   console.log(actionData);
//               }}
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               className="py-2 dark:text-gray-200 text-yellow-600 hover:cursor-pointer hover:text-primary bg-primary/40 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 console.log(row.original.id);
//                 navigate(`/jobs-list-pending/${row.original.id}`);
//               }}
//             >
//               Action
//             </button>
//             <button
//               type="button"
//               className="py-2 dark:text-gray-200 text-red-500 hover:cursor-pointer hover:text-red-500 bg-red-200/90 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowDeleteDialog(true);
//                 setSelectedRowId(row.original.id);
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
