import {
  File,
  Home,
  CheckCircleIcon,
  // LogOut,
  // Settings,
  User2,
  Library,
  Hammer,
  Clock,
  Bolt,
  // MoveHorizontal,
  Truck,
  Users2,
  Hourglass,
  FileClock,
  List,
  ArchiveX,
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
    icon: Hammer,
    url: "/jobs/create-job",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "pending approval",
    icon: Hourglass,
    url: "/jobs/pending-approval",
    allowedGroups: ["admin"],
  },
  {
    name: "open jobs",
    icon: FileClock,
    url: "/jobs/in-progress",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: ({ groups }) =>
      groups.includes("admin") ? "Completed Jobs" : "My Jobs",
    icon: CheckCircleIcon,
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
    name: "create asset",
    icon: File,
    url: "/assets/create-new-asset", // frontend routes only, POST: /assets for backend
    allowedGroups: ["admin"],
  },
  {
    name: "assets register",
    icon: Library,
    url: "/assets/list", // frontend routes only, GET: /assets for backend
    allowedGroups: ["admin"],
  },
  {
    name: "assets verification",
    icon: Library,
    url: "/assets/verification", // frontend routes only, GET: /assets for backend
    allowedGroups: ["admin", "manager"],
  },
] as const;

export const transferLinks: NavlinkProps[] = [
  {
    name: "create transfer",
    icon: Truck,
    url: "/transfers/create-new-transfer",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "pending approval",
    icon: Hourglass,
    url: "/transfers/pending-approval",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "open transfers",
    icon: FileClock,
    url: "/transfers/in-transit",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: ({ groups }) =>
      groups.includes("admin") ? "Completed Transfers" : "My Transfers",
    icon: CheckCircleIcon,
    url: "/transfers/completed",
    allowedGroups: ["admin", "technician", "manager", "contractor"],
  },
] as const;

export const disposalLinks: NavlinkProps[] = [
  {
    name: "create disposal",
    icon: ArchiveX,
    url: "/disposals/create-new-disposal",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "pending approval",
    icon: Hourglass,
    url: "/disposals/pending-approval",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: "open disposals",
    icon: FileClock,
    url: "/disposals/in-progress",
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
  {
    name: ({ groups }) =>
      groups.includes("admin") ? "Completed Disposals" : "My Disposals",
    icon: CheckCircleIcon,
    url: "/disposals/completed",
    allowedGroups: ["admin", "technician", "manager"],
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
    name: "My Profile",
    icon: User2,
    url: "/users/profile",
    allowedGroups: ["admin", "user", "technician", "manager", "contractor"],
  },
];

export const stockLinks: NavlinkProps[] = [
  // { name: "Settings", icon: Settings, url: "/settings" },
  {
    name: "Create Stock Item",
    icon: Bolt,
    url: "/stocks/create-new-stock", // frontend routes only, POST: /stocks for backend
    allowedGroups: ["admin"],
  },
  {
    name: "Stock Register",
    icon: List,
    url: "/stocks/list", // frontend routes only, GET: /stocks for backend
    allowedGroups: ["admin", "user", "technician", "manager"],
  },
];

/**
 * This structure allows us to easily map over sections and their respective links in the Sidebar component, while keeping all related data organized in one place. Each section has a heading and an array of links, which can be rendered conditionally based on user groups.
 *
 * @example
 * const sidebarSectionData = [
 *  { heading: "Main", data: mainLinks },
 *   { heading: "Maintenance", data: maintenanceLinks },
 *  { heading: "Assets", data: assetLinks },
 * { heading: "Profile", data: profileLinks },
 * ];
 *
 * In the Sidebar component, we can then do:
 *
 * {sidebarSectionData.map(section => (
 *   <SidebarSection heading={section.heading} data={section.data} />
 * ))}
 *
 * This keeps our Sidebar component clean and focused on rendering, while all the data logic is handled here in the navbarLinks file.
 *
 * Note: The `allowedGroups` property in each link allows us to control visibility based on user roles, which can be checked in the SidebarSection component when rendering links.
 *
 */
export const sidebarSectionData = [
  { heading: "Main", data: mainLinks },
  { heading: "Maintenance", data: maintenanceLinks },
  { heading: "Assets", data: assetLinks },
  { heading: "Asset Transfers", data: transferLinks },
  { heading: "Stock Management", data: stockLinks },
  { heading: "Disposals", data: disposalLinks },
  { heading: "Profile", data: profileLinks },
];
