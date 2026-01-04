import { Pencil, Trash2Icon, Wrench } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export type TableMenuProps = {
  id: number;
  url: string;
  name: string;
  icon: React.ComponentType;
  action: Dispatch<SetStateAction<boolean>>;
};

export const getMaintenanceTableMenuItems = (
  setShowUpdateDialog: Dispatch<SetStateAction<boolean>>,
  setShowActionDialog: Dispatch<SetStateAction<boolean>>,
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
): TableMenuProps[] => [
  {
    id: 1,
    url: "/update-request",
    name: "Edit",
    icon: Pencil,
    action: setShowUpdateDialog,
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
