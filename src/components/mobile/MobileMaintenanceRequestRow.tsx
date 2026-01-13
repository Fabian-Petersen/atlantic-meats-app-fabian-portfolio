import type { CreateJobFormValues } from "@/schemas";
import { ChevronDown } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  row: Row<CreateJobFormValues>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileMaintenanceRequestRow({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { setGenericData } = useGlobalContext();
  return (
    <div
      className="hover:cursor-pointer dark:border rounded-md p-3 mb-2 bg-gray-100 dark:bg-bgdark"
      onClick={onToggle}
    >
      <div className="flex justify-between items-start dark:text-gray-200">
        <p className="font-medium">{row.original.store}</p>
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <div className="flex justify-between text-xs mt-2 text-gray-500">
        <span>{row.original.createdAt}</span>
        <span>{row.original.priority}</span>
      </div>

      {isOpen && (
        <div className="mt-3 text-sm grid gap-2">
          <span>{row.original.additional_notes}</span>
          <div className="flex flex-col">
            <span>{row.original.equipment}</span>
            {/* <span>{row.original.assetID}</span> Add the asset ID */}
          </div>
          <button
            className="bg-primary w-full rounded-sm py-2 text-white hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log(row.original.id);
              navigate(`/maintenance-action/${row.original.id}`);
              setGenericData(row.original);
              //   console.log(actionData);
            }}
          >
            Action
          </button>
        </div>
      )}
    </div>
  );
}
