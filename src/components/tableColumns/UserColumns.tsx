import type { ColumnDef } from "@tanstack/react-table";
import type { UsersAPIResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
import type { SuccessConfig } from "@/context/app-types";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import type { NavigateFunction } from "react-router-dom";

type UserGroupStatus = "user" | "manager" | "maintenance" | "admin";

export const getUserColumns = (
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
  navigate: NavigateFunction,
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
  },
  {
    id: "fullName",
    accessorFn: (user) =>
      [user.name, user.family_name].filter(Boolean).join(" "),
    header: "Full Name",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "—"}</p>;
    },
    size: 160,
    minSize: 140,
    maxSize: 160,
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
    accessorKey: "position",
    header: "Position",
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
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
    accessorKey: "group",
    header: "Group",
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          value={value as UserGroupStatus}
          styleMap={badgeStyles.families.user_group_status}
          className="capitalize"
        />
      );
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
    size: 56,
    minSize: 56,
    maxSize: 56,
    cell: ({ row }) => {
      const rowId = row.original.id;
      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,
        userStatus: row.original.status,

        create: {
          url: "/users/create-user",
          onOpen: () => {
            navigate("/users/create-user");
          },
        },
        edit: {
          url: `/users/profile`,
          onOpen: () => {
            setSelectedRowId(rowId);
          },
        },

        delete: {
          config: {
            resourcePath: "api/users",
            queryKey: ["users"],
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
