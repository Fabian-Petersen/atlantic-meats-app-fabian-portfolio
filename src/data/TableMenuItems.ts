import { Pencil, Trash2Icon, type LucideIcon } from "lucide-react";

export type TableMenuProps = {
  id: string;
  url?: string;
  name: string;
  icon: LucideIcon;
  openModal: (v: boolean) => void;
  action: (id: string) => Promise<void>;
};

export const getAssetTableMenuItems = (
  setShowUpdateDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  deleteItem: (id: string) => Promise<void>
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

// export const getMaintenanceTableMenuItems = (
//   // setShowUpdateMaintenanceDialog: (v: boolean) => void,
//   // setShowActionDialog: (v: boolean) => void,
//   setShowDeleteDialog: (v: boolean) => void
// ): TableMenuProps[] => [
//   // {
//   //   id: 1,
//   //   url: "/update-request",
//   //   name: "Edit",
//   //   icon: Pencil,
//   //   openModal: setShowUpdateMaintenanceDialog,
//   //   action:
//   // },
//   // {
//   //   id: 2,
//   //   url: "/maintenance-action",
//   //   name: "Action",
//   //   icon: Wrench,
//   //   openModal: setShowActionDialog,
//   //   action:
//   // },
//   {
//     id: 3,
//     name: "Delete",
//     icon: Trash2Icon,
//     openModal: setShowDeleteDialog,
//     action: setPendingAction,
//   },
// ];
