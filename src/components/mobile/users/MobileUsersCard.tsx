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
import { CardRow } from "../CardRow";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type Props = {
  row: Row<UsersAPIResponse>;
  isOpen: boolean;
  setOpen?: Dispatch<SetStateAction<string | null>>;
  onToggle: () => void;
};

export function MobileUsersCard({ row, isOpen, setOpen, onToggle }: Props) {
  const item = row.original;
  const navigate = useNavigate();

  const { setSelectedRowId, openDeleteDialog } = useGlobalContext();

  const menuItems = getTableMenuItems({
    rowId: item.id,
    setSelectedRowId,
    edit: {
      onOpen: () => navigate(`/users/${item.id}`),
    },
    delete: {
      config: {
        resourcePath: "api/users",
        queryKey: ["userRequests"],
        resourceName: "user",
      },
      onDelete: (id, config) => {
        setOpen?.(null);
        openDeleteDialog(id, config);
      },
    },
  });

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOpen && sharedStyles.cardIsOpen,
      )}
    >
      <div
        role="button"
        tabIndex={0}
        className={cn(sharedStyles.cardBtn, "gap-0")}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        {/* Location + meta row */}
        <div className={sharedStyles.mobileCardHeaderContent}>
          <CardRow
            icon={User}
            value={`${item.name} ${item.family_name}`}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardTitle}
            iconStyles="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
          />
          <CardRow
            icon={MapPin}
            value={item.location}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardMeta}
            iconStyles="w-3.5 h-3.5 text-green-500 dark:text-green-400"
          />
        </div>
        <div className={sharedStyles.mobileCardActions}>
          <div onClick={(event) => event.stopPropagation()}>
            <DropdownMenuButtonDialog menuItems={menuItems} />
          </div>
          <ChevronDown
            className={cn(
              sharedStyles.mobileCardChevron,
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
