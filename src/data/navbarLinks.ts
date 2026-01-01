import {
  File,
  Home,
  // LogOut,
  // Settings,
  User2,
  Library,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavlinkProps = {
  name: string;
  icon: LucideIcon;
  url: string;
};

// export type SidebarLinkItemProps = {
//   name: string;
//   icon: LucideIcon;
//   url: string;
// };

// export type MaintenanceItemProps = {
//   name: string;
//   icon: LucideIcon;
//   url: string;
// };

// export type assetItemProps = {
//   name: string;
//   icon: LucideIcon;
//   url: string;
// };

// export type PreferencesLinksProps = {
//   name: string;
//   icon: LucideIcon;
//   url: string;
// };

// export type AuthLinks = {
//   name: string;
//   icon: LucideIcon;
// };

export const mainLinks: NavlinkProps[] = [
  { name: "dashboard", icon: Home, url: "/dashboard" },
] as const;

export const maintenanceLinks: NavlinkProps[] = [
  { name: "create request", icon: Wrench, url: "/maintenance-request" },
  { name: "view requests", icon: File, url: "/maintenance-list" },
] as const;

export const assetLinks: NavlinkProps[] = [
  { name: "create asset", icon: File, url: "/create-asset" },
  { name: "asset register", icon: Library, url: "/asset" },
] as const;

export const profileLinks: NavlinkProps[] = [
  // { name: "Settings", icon: Settings, url: "/settings" },
  { name: "User Profile", icon: User2, url: "/user-profile" },
];

// export const AuthLinks: AuthLinks[] = [{ name: "Logout", icon: LogOut }];
