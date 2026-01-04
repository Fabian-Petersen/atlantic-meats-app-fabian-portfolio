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
    url: "/action-request",
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

// const pageLinkData: PageLinksTypes[] = [
//   {
//     id: 1,
//     url: "/#dashboard",
//     name: "dashboard",
//     icon: PieChart,
//     tooltip_content: "dashboard",
//   },
//   {
//     id: 2,
//     url: "/#request-service",
//     name: "request service",
//     icon: BarChart2,
//     tooltip_content: "request service",
//   },
//   {
//     id: 3,
//     url: "/#order",
//     name: "order",
//     icon: ShoppingCart,
//     tooltip_content: "order",
//   },
//   {
//     id: 4,
//     url: "/#products",
//     name: "products",
//     icon: ShoppingBag,
//     tooltip_content: "products",
//   },
//   {
//     id: 5,
//     url: "/#sales report",
//     name: "sales report",
//     icon: LineChart,
//     tooltip_content: "sales report",
//   },
//   {
//     id: 6,
//     url: "/#messages",
//     name: "messages",
//     icon: MessageSquareMoreIcon,
//     tooltip_content: "messages",
//   },
//   {
//     id: 7,
//     url: "/#settings",
//     name: "settings",
//     icon: Settings,
//     tooltip_content: "settings",
//   },
// ];

// export default pageLinkData;
