import type { ColumnDef } from "@tanstack/react-table";
import type { Priority } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
// import type { Resource } from "@/utils/api";
import { ChevronDown } from "lucide-react";
import { badgeStyles } from "@/styles/badgeStyles";
import { Badge } from "../features/Badge";
import type { AssetHistoryItem } from "@/schemas/assetSchemas";

export const getAssetHistoryColumns = (
  //   setShowUpdateMaintenanceDialog: (v: boolean) => void,
  navigate: (path: string) => void,
  setSelectedRowId: (id: string) => void,
  //   openDeleteDialog: (
  //     selectedRowId: string,
  //     config: { resourcePath: Resource; queryKey: readonly unknown[] },
  //   ) => void,
  //   setOpenChatSidebar: (v: boolean) => void,
): ColumnDef<AssetHistoryItem>[] => [
  {
    accessorKey: "jobCreated",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Date Created</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{
              transform: sorted === "asc" ? "rotate(180deg)" : "rotate(0deg)",
              opacity: sorted ? 1 : 0.4,
            }}
          />
        </button>
      );
    },
    minSize: 130,
    maxSize: 150,
  },
  {
    accessorKey: "location",
    header: "Location",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: "description",
    header: "Description",
    minSize: 240,
    maxSize: 300,
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    enableColumnFilter: false,
  },
  {
    accessorKey: "sundries",
    header: "Sundries",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 70,
    maxSize: 90,
  },
  {
    accessorKey: "jobcardNumber",
    header: "Jobcard Number",
    enableColumnFilter: true,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: "parts",
    header: "Parts",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          value={value as Priority}
          styleMap={badgeStyles.families.priority}
        />
      );
    },
  },
  {
    accessorKey: "assign_to_name",
    header: "Assigned To",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 100,
    maxSize: 120,
  },
  {
    accessorKey: "completed_at",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Date Completed</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{
              transform: sorted === "asc" ? "rotate(180deg)" : "rotate(0deg)",
              opacity: sorted ? 1 : 0.4,
            }}
          />
        </button>
      );
    },
    minSize: 130,
    maxSize: 150,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const rowId = row.original.id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,

        action: {
          url: `/jobs/${rowId}/action`,
          onOpen: () => {
            navigate(`/jobs/${rowId}/action`);
            setSelectedRowId(rowId);
          },
        },
      });

      return (
        <div className="tex-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
    minSize: 60,
    maxSize: 70,
  },
];
