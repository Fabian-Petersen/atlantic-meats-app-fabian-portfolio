import { Pencil, Trash2Icon, Wrench, type LucideIcon } from "lucide-react";

export type TableMenuProps = {
  id: number;
  url?: string;
  name: string;
  icon: LucideIcon;
  action: (v: boolean) => void;
};

export const getMaintenanceTableMenuItems = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void
): TableMenuProps[] => [
  {
    id: 1,
    url: "/update-request",
    name: "Edit",
    icon: Pencil,
    action: setShowUpdateMaintenanceDialog,
  },
  {
    id: 2,
    url: "/maintenance-action",
    name: "Action",
    icon: Wrench,
    action: setShowActionDialog,
  },
  {
    id: 3,
    url: "/delete-request",
    name: "Delete",
    icon: Trash2Icon,
    action: setShowDeleteDialog,
  },
];

export const getAssetTableMenuItems = (
  setShowUpdateDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void
): TableMenuProps[] => [
  {
    id: 1,
    url: "/update-asset",
    name: "Edit",
    icon: Pencil,
    action: setShowUpdateDialog,
  },
  {
    id: 2,
    url: "/delete-asset",
    name: "Delete",
    icon: Trash2Icon,
    action: setShowDeleteDialog,
  },
];

// const {
//   setShowUpdateMaintenanceDialog,
//   setShowActionDialog,
//   setShowDeleteDialog,
// } = useGlobalContext();

// const menuItems = getMaintenanceTableMenuItems(
//   setShowUpdateMaintenanceDialog,
//   setShowActionDialog,
//   setShowDeleteDialog
// );
