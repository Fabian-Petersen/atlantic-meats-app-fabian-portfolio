import type { JobAPIResponse } from "@/schemas";
import { ChevronDown } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  row: Row<JobAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileMaintenanceRequestRow({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { setGenericData, setShowDeleteDialog, genericData } =
    useGlobalContext();

  console.log(genericData);
  return (
    <div
      className="hover:cursor-pointer dark:border rounded-md p-3 mb-2 bg-gray-100 dark:bg-bgdark"
      onClick={onToggle}
    >
      <div className="flex justify-between items-start dark:text-gray-200">
        <p className="font-medium">{row.original.location}</p>
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      <div className="mt-auto">
        <p className="font-medium text-md">{row.original.status}</p>
      </div>

      <div className="flex justify-between text-xs mt-2 text-gray-500">
        <span>{row.original.jobCreated}</span>
        <span>{row.original.priority}</span>
      </div>

      {isOpen && (
        <div className="mt-3 text-sm grid gap-2">
          <div className="flex gap-2 text-xs text-gray-500 w-full justify-between">
            <span className="capitalize">{row.original.equipment}</span>
            <span>{row.original.assetID}</span>
          </div>
          <div className="flex gap-2 text-sm my-2">
            <span>{row.original.jobComments}</span>
          </div>
          <div className="w-full flex gap-12 justify-between mt-auto">
            <button
              type="button"
              className="py-1 dark:text-gray-200 text-green-700 hover:cursor-pointer hover:text-green-700 bg-green-200/90 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                console.log(row.original.id);
                navigate(`/maintenance-list/${row.original.id}`);
                setGenericData(row.original);
                //   console.log(actionData);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="py-2 dark:text-gray-200 text-yellow-600 hover:cursor-pointer hover:text-primary bg-primary/40 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                console.log(row.original.id);
                navigate(`/maintenance-action/${row.original.id}`);
              }}
            >
              Action
            </button>
            <button
              type="button"
              className="py-2 dark:text-gray-200 text-red-500 hover:cursor-pointer hover:text-red-500 bg-red-200/90 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
                setGenericData(row.original);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
