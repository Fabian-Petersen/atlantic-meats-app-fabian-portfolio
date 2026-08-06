import type { UsersAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import type { Dispatch, SetStateAction } from "react";
import {
  ChevronDown,
  MapPin,
  Mail,
  User,
  Smartphone,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { CardRow } from "./CardRow";

type Props = {
  row: Row<UsersAPIResponse>;
  isOpen: boolean;
  setOpen?: Dispatch<SetStateAction<string | null>>;
  onToggle: () => void;
};

export function MobileUsersCard({ row, isOpen, setOpen, onToggle }: Props) {
  const item = row.original;
  const navigate = useNavigate();

  const { setSelectedRowId, setShowDeleteDialog, setDeleteConfig } =
    useGlobalContext();

  return (
    <div
      className={cn(sharedStyles.cardRowParent, "flex flex-col")}
      onClick={onToggle}
    >
      <button
        type="button"
        className={cn(sharedStyles.cardBtn, "gap-0")}
        onClick={onToggle}
      >
        {/* Location + meta row */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <CardRow
            icon={User}
            value={`${item.name} ${item.family_name}`}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles="text-md font-semibold dark:text-white/90"
            iconStyles="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
          />
          <CardRow
            icon={MapPin}
            value={item.location}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles="text-xs"
            iconStyles="w-3.5 h-3.5 text-green-500 dark:text-green-400"
          />
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 py-3 flex flex-col gap-2 mt-2">
          {/* Detail rows — divide-y adds border between each child automatically */}
          <div
            className={clsx(
              "divide-y divide-gray-100 dark:divide-gray-700/60",
              "[&>*:last-child]:border-b [&>*:last-child]:border-gray-100",
              "dark:[&>*:last-child]:border-gray-700/60",
            )}
          >
            {/* User Group */}
            <div className="flex justify-between items-center gap-1 py-1">
              <CardRow
                label="Group"
                className=""
                valueStyles="hidden"
                icon={Users}
                iconStyles="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0"
              />
              <CardRow
                className=""
                valueStyles="font-mono lowercase"
                value={item.group}
                iconStyles="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0"
              />
            </div>
            {/* User Email */}
            <div className="flex justify-between items-center py-1">
              <CardRow
                label="Email"
                className=""
                valueStyles="hidden"
                icon={Mail}
                iconStyles="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0"
              />
              <CardRow
                className=""
                valueStyles="font-mono lowercase shrink-0 text-gray-500 dark:text-gray-400"
                value={item.email}
              />
            </div>
            {/* Mobile Number */}
            <div className="flex justify-between items-center py-1">
              <CardRow
                label="Mobile"
                className=""
                valueStyles="hidden"
                icon={Smartphone}
                iconStyles="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0"
              />
              <CardRow
                className=""
                valueStyles="font-mono lowercase shrink-0 text-gray-500 dark:text-gray-400"
                value={item.mobile}
              />
            </div>
          </div>

          {/* // $ -------------------- Action Buttons -------------------------- */}
          <div className="flex gap-2 mt-3 pt-3 px-0 md:px-4">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfig({
                  resourcePath: `api/users`,
                  queryKey: ["userRequests"],
                  resourceName: "user",
                });
                setOpen?.(null);
                setShowDeleteDialog(true);
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg dark:bg-green/20 bg-green-500/10 border-green/20 hover:bg-green-500/90 hover:shadow-md text-green-500 border dark:border-green/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(item.id);
                navigate(`/users/${item.id}`);
              }}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
