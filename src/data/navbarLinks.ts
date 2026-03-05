import {
  File,
  Home,
  // LogOut,
  // Settings,
  User2,
  Library,
  Wrench,
  Clock,
  // MoveHorizontal,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserGroup =
  | "admin"
  | "technician"
  | "manager"
  | "user"
  | "contractor";

export type NavlinkProps = {
  name: string | ((args: { groups: UserGroup[] }) => string);
  icon: LucideIcon;
  url: string;
  allowedGroups?: UserGroup[]; // omit = visible to all
};

export const mainLinks: NavlinkProps[] = [
  { name: "dashboard", icon: Home, url: "/dashboard" },
] as const;

export const maintenanceLinks: NavlinkProps[] = [
  {
    name: "create request",
    icon: Wrench,
    url: "/maintenance-request",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "approval requests",
    icon: File,
    url: "/maintenance-requests-list",
    allowedGroups: ["admin"],
  },
  {
    name: ({ groups }) => (groups.includes("admin") ? "All Tasks" : "My Tasks"),
    icon: File,
    url: "/maintenance-actions-list",
    allowedGroups: ["admin", "technician", "manager", "contractor"],
  },
  {
    name: "open requests",
    icon: File,
    url: "/approval-requests-list",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "schedule task",
    icon: Clock,
    url: "#",
    allowedGroups: ["admin"],
  },
] as const;

export const actionLinks: NavlinkProps[] = [
  {
    name: "task history",
    icon: Library,
    url: "/maintenance-actions-list",
    allowedGroups: ["admin", "technician", "contractor"],
  },
] as const;

export const assetLinks: NavlinkProps[] = [
  {
    name: "create new",
    icon: File,
    url: "/asset",
    allowedGroups: ["admin"],
  },
  {
    name: "transfer request",
    icon: Truck,
    url: "#",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "assets register",
    icon: Library,
    url: "/assets-list",
    allowedGroups: ["admin"],
  },
] as const;

export const profileLinks: NavlinkProps[] = [
  // { name: "Settings", icon: Settings, url: "/settings" },
  {
    name: "User Profile",
    icon: User2,
    url: "/user-profile",
    allowedGroups: ["admin", "user", "technician", "manager", "contractor"],
  },
];
