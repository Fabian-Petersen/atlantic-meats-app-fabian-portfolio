import {
  Pencil,
  Trash2Icon,
  Wrench,
  type LucideIcon,
  DownloadIcon,
} from "lucide-react";

export type TableMenuProps = {
  id: string;
  url?: string;
  name: string;
  icon: LucideIcon;
  openModal?: (v: boolean) => void;
  action: (id: string) => Promise<void>;
};

type TableAction = (id: string) => Promise<void>;

export const getAssetTableMenuItems = (
  setShowUpdateDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  deleteItem: (id: string) => Promise<void>,
): TableMenuProps[] => [
  {
    id: "1",
    name: "Edit",
    icon: Pencil,
    openModal: setShowUpdateDialog,
    action: deleteItem,
  },
  {
    id: "2",
    name: "Delete",
    icon: Trash2Icon,
    openModal: setShowDeleteDialog,
    action: deleteItem,
  },
];

export const getMaintenanceTableMenuItems = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  deleteItem: TableAction,
  downloadItem: TableAction,
): TableMenuProps[] => [
  {
    id: "1",
    url: "/update-request",
    name: "Edit",
    icon: Pencil,
    openModal: setShowUpdateMaintenanceDialog,
    action: deleteItem,
  },
  {
    id: "2",
    url: "/maintenance-action",
    name: "Action",
    icon: Wrench,
    openModal: setShowActionDialog,
    action: deleteItem,
  },
  {
    id: "3",
    name: "Delete",
    icon: Trash2Icon,
    openModal: setShowDeleteDialog,
    action: deleteItem,
  },
  {
    id: "4",
    name: "Download",
    icon: DownloadIcon,
    action: downloadItem,
  },
];
