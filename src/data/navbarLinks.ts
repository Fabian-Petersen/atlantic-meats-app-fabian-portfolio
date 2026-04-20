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
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserGroup } from "@/schemas/usersSchema";

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
    url: "/jobs/create-job",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "pending approval",
    icon: File,
    url: "/jobs/pending-approval",
    allowedGroups: ["admin"],
  },
  {
    name: "open requests",
    icon: File,
    url: "/jobs/in-progress",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: ({ groups }) =>
      groups.includes("admin") ? "Completed Jobs" : "My Jobs",
    icon: File,
    url: "/jobs/completed",
    allowedGroups: ["admin", "technician", "manager", "contractor"],
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
    url: "/jobs/actioned",
    allowedGroups: ["admin", "technician", "contractor"],
  },
] as const;

export const assetLinks: NavlinkProps[] = [
  {
    name: "create new",
    icon: File,
    url: "/assets/create-new-asset", // frontend routes only, POST: /assets for backend
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
    url: "/assets/list", // frontend routes only, GET: /assets for backend
    allowedGroups: ["admin"],
  },
] as const;

export const profileLinks: NavlinkProps[] = [
  // { name: "Settings", icon: Settings, url: "/settings" },
  {
    name: "User List",
    icon: Users2,
    url: "/users",
    allowedGroups: ["admin"],
  },
  {
    name: "User Profile",
    icon: User2,
    url: "/users/profile",
    allowedGroups: ["admin", "user", "technician", "manager", "contractor"],
  },
];
