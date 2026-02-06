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
  action?: () => void | Promise<void>;
  onClick: () => void | Promise<void>;
};

export type TableMenuProps = {
  label: string;
  openModal?: (v: boolean) => void;
  id: string;
  icon: LucideIcon;
  url?: string;
  downloadItem?: (id: string) => Promise<void>;
  deleteItem?: (id: string) => Promise<void>;
  updateItem?: (id: string) => Promise<void>;
};

export const getAssetTableMenuItems = (
  selectedRowId: string,
  setShowUpdateDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  deleteItem: (id: string) => Promise<void>,
  updateItem: (id: string) => Promise<void>,
): TableMenuItemActions[] => [
  {
    id: "1",
    label: "Edit",
    icon: Pencil,
    onClick: () => setShowUpdateDialog(true),
    action: () => updateItem(selectedRowId),
  },
  {
    id: "2",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => setShowDeleteDialog(true),
    action: () => deleteItem(selectedRowId),
  },
];

export const getMaintenanceTableMenuItems = (
  selectedRowId: string,
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<void>,
): TableMenuItemActions[] => [
  {
    id: "1",
    url: "/update-request",
    label: "Edit",
    icon: Pencil,
    onClick: () => {
      console.log("update-maintenance-id:", selectedRowId);
      setShowUpdateMaintenanceDialog(true);
      setSelectedRowId(selectedRowId);
    },
  },
  {
    id: "2",
    url: "/maintenance-action",
    label: "Action",
    icon: Wrench,
    onClick: () => {
      setShowActionDialog(true);
      setSelectedRowId(selectedRowId);
    },
  },
  {
    id: "3",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => {
      setShowDeleteDialog(true);
      setSelectedRowId(selectedRowId);
    },
  },
  {
    id: "4",
    label: "Download",
    url: "maintenance-jobcard",
    icon: DownloadIcon,
    onClick: () => {
      downloadItem(selectedRowId);
    },
  },
];
