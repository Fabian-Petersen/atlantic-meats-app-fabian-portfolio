import type { UsersAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import {
  ChevronDown,
  MapPin,
  //   Calendar,
  Wrench,
  //   FileClock,
  User,
  Clock2Icon,
} from "lucide-react";

type Props = {
  row: Row<UsersAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileUsersCard({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();

  const { setSelectedRowId } = useGlobalContext();

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                `${row.original.name} ${row.original.family_name}`
              </span>
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* Equipment + Asset ID */}
          <div className="flex items-start gap-2">
            <Wrench className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-200 capitalize font-medium">
                {row.original.username}
              </span>
              <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                #{row.original.group}
              </span>
            </div>
          </div>
          {/* Target Date &Technician */}
          <div className="flex items-start gap-2">
            <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="capitalize text-xs text-gray-500 font-mono shrink-0 dark:text-gray-200">
                {row.original.email_verified}
              </span>
              <div className="flex gap-1 dark:text-gray-500">
                <Clock2Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="text-xs  capitalize font-medium">
                  {/* {row.original.jobCreated} */}
                </span>
              </div>
            </div>
          </div>

          {/* // $ -------------------- Action Buttons -------------------------- */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user-profile/${row.original.id}`);
                setSelectedRowId(row.original.id);
              }}
            >
              View User
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg dark:bg-green/20 bg-green-500/10 border-green/20 hover:bg-green-500/90 hover:shadow-md text-green-500 border dark:border-green/30 transition-colors "
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/${row.original.id}`);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
