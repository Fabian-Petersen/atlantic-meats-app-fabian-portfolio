import type { ColumnDef } from "@tanstack/react-table";
import type { UsersAPIResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
// import { Badge } from "../ui/badge";
import type { SuccessConfig } from "@/context/app-types";

export const getUserColumns = (
  setShowCreateUserDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: {
      resourcePath: Resource;
      queryKey: readonly unknown[];
      resourceName?: string;
    },
  ) => void,
  resend: (email: string) => Promise<void>,
  setShowSuccess: (v: boolean) => void,
  setSuccessConfig: (v: SuccessConfig) => void,
): ColumnDef<UsersAPIResponse>[] => [
  {
    accessorKey: "userCreated",
    header: "Date Created",
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    // sortingFn: "datetime",
  },
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "family_name",
    header: "Last Name",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "group",
    header: "Group",
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="">{value}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="">{value}</p>;
    },
  },
  {
    accessorKey: "mobile",
    header: "mobile",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="">{value}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ getValue }) => {
      const value = getValue<boolean>();
      return <p className="">{value}</p>;
    },
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
        userStatus: row.original.status,

        create: {
          url: "/users",
          onOpen: () => {
            setShowCreateUserDialog(true);
          },
        },
        edit: {
          url: `/users/${rowId}`,
          onOpen: () => {
            // setShowUpdateUserDialog(true);
            setSelectedRowId(rowId);
          },
        },

        delete: {
          config: {
            resourcePath: "users",
            queryKey: ["userRequests"],
            resourceName: "user",
          },
          onDelete: openDeleteDialog,
        },
        resend: {
          onResend: async (rowId) => {
            await resend(rowId);
            setShowSuccess(true);
            setSuccessConfig({
              message: `Successfully resend password to user ${row.original.name}`,
            });
          },
        },
      });
      return (
        <div className="tex-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];
