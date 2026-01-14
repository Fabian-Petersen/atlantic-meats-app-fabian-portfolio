import type { AssetFormValues } from "@/schemas";
import { ChevronDown } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  row: Row<AssetFormValues>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileAssetViewRow({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { setGenericData } = useGlobalContext();
  return (
    <div
      className="hover:cursor-pointer dark:border rounded-md p-2 mb-2 bg-gray-100 dark:bg-bgdark"
      onClick={onToggle}
    >
      <div className="flex justify-between items-start dark:text-gray-200">
        <p className="font-medium">{row.original.equipment}</p>
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-200">
        <span>{row.original.location}</span>
        <span>{row.original.assetID}</span>
      </div>

      {isOpen && (
        <div className="mt-3 text-xs grid gap-6">
          <ul className="grid gap-4">
            <li className="flex gap-2 w-full justify-between">
              <span>Condition</span>
              <span>{row.original.condition}</span>
            </li>
            <li className="flex gap-2 w-full justify-between">
              <span>Serial Number</span>
              <span>{row.original.serialNumber}</span>
            </li>
          </ul>
          <div className="w-full flex gap-12 justify-between mt-auto">
            <button
              className="py-1 dark:text-gray-200 text-green-700 hover:cursor-pointer hover:text-green-700 bg-green-200/90 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                console.log(row.original.id);
                navigate(`/asset/${row.original.id}`);
                setGenericData(row.original);
                //   console.log(actionData);
              }}
            >
              Edit
            </button>
            <button
              className="py-2 dark:text-gray-200 text-yellow-600 hover:cursor-pointer hover:text-primary bg-primary/40 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                console.log(row.original.id);
                navigate(`/asset/${row.original.id}`);
                setGenericData(row.original);
                //   console.log(actionData);
              }}
            >
              View
            </button>
            <button
              className="py-2 dark:text-gray-200 text-red-500 hover:cursor-pointer hover:text-red-500 bg-red-200/90 flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                console.log(row.original.id);
                navigate(`/asset/${row.original.id}`);
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
