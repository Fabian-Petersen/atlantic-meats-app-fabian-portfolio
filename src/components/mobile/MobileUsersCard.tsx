import type { UsersAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import type { Dispatch, SetStateAction } from "react";
import {
  ChevronDown,
  MapPin,
  Mail,
  Users,
  User,
  Smartphone,
} from "lucide-react";
import clsx from "clsx";

type Props = {
  row: Row<UsersAPIResponse>;
  isOpen: boolean;
  setOpen?: Dispatch<SetStateAction<string | null>>;
  onToggle: () => void;
};

export function MobileUsersCard({ row, isOpen, setOpen, onToggle }: Props) {
  const navigate = useNavigate();

  const { setSelectedRowId, setShowDeleteDialog, setDeleteConfig } =
    useGlobalContext();

  return (
    <div
      className="rounded-md border border-gray-200 dark:border-(--clr-borderDark) bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm"
      onClick={onToggle}
    >
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        {/* Location + meta row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate capitalize">
              {row.original.location}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1 capitalize">
                <User className="w-3 h-3" />
                {row.original.name} {""}
                {row.original.family_name}
              </span>
            </div>
          </div>
        </div>
        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 py-3 flex flex-col gap-2">
          {/* Detail rows — divide-y adds border between each child automatically */}
          <div
            className={clsx(
              "divide-y divide-gray-100 dark:divide-gray-700/60",
              "[&>*:last-child]:border-b [&>*:last-child]:border-gray-100",
              "dark:[&>*:last-child]:border-gray-700/60",
            )}
          >
            {/* User Group */}
            <div className="flex justify-between items-center py-2 px-4">
              <div className="flex gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-200 font-medium">
                  Group
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                  {row.original.group}
                </span>
              </div>
            </div>
            {/* User Email */}
            <div className="flex justify-between items-center py-2 px-4">
              <div className="flex gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-200 font-medium">
                  Email
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                  {row.original.email}
                </span>
              </div>
            </div>
            {/* Mobile Number */}
            <div className="flex justify-between items-center py-2 px-4">
              <div className="flex gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-200 font-medium">
                  Mobile
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                  {row.original.mobile}
                </span>
              </div>
            </div>
          </div>

          {/* // $ -------------------- Action Buttons -------------------------- */}
          <div className="flex gap-2 mt-3 pt-3 px-4">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfig({
                  resourcePath: `admin/users`,
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
                setSelectedRowId(row.original.id);
                navigate(`/admin/users/${row.original.id}`);
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
