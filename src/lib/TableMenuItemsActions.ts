// $ The functions that managed the actions committed by the dropdown menu items menu for the tables.

import {
  Pencil,
  Trash2Icon,
  Wrench,
  type LucideIcon,
  DownloadIcon,
} from "lucide-react";

export type TableMenuItemActions = {
  label: string;
  id: string;
  icon: LucideIcon;
  url?: string;
  onClick: () => void | Promise<void>;
};

import type { Resource } from "@/utils/api";

export const getAssetTableMenuItems = (
  rowId: string,
  setSelectedRowId: (id: string) => void,
  setShowUpdateAssetDialog: (v: boolean) => void,
  // setShowDeleteDialog: (v: boolean) => void,
  // openDeleteDialog: AppContextType["openDeleteDialog"],
  openDeleteDialog: (
    id: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
): TableMenuItemActions[] => [
  {
    id: "1",
    label: "Edit",
    icon: Pencil,
    onClick: () => {
      setShowUpdateAssetDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "2",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => {
      openDeleteDialog(rowId, {
        resourcePath: "asset",
        queryKey: ["ASSETS_DELETE_KEY"] as const,
      });
      // console.log("delete-asset-id:", rowId);
    },
  },
];

export const getMaintenanceTableMenuItems = (
  rowId: string,
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  // setShowDeleteDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<void>,
  openDeleteDialog: (
    id: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
): TableMenuItemActions[] => [
  {
    id: "1",
    url: "/update-request",
    label: "Edit",
    icon: Pencil,
    onClick: () => {
      // console.log("update-maintenance-id:", rowId);
      setShowUpdateMaintenanceDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "2",
    url: "/maintenance-action",
    label: "Action",
    icon: Wrench,
    onClick: () => {
      setShowActionDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "3",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => {
      openDeleteDialog(rowId, {
        resourcePath: "maintenance-request",
        queryKey: ["MAINTENANCE_DELETE_KEY"] as const,
      });
      setSelectedRowId(rowId);
    },
  },
  {
    id: "4",
    label: "Download",
    url: "maintenance-jobcard",
    icon: DownloadIcon,
    onClick: () => {
      downloadItem(rowId);
    },
  },
];
