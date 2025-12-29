import {
  File,
  Home,
  LogOut,
  Settings,
  User2,
  Library,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarLinkItemProps = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export type MaintenanceItemProps = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export type assetItemProps = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export type PreferencesLinksProps = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export type AuthLinks = {
  name: string;
  icon: LucideIcon;
};

export const mainLinks: MaintenanceItemProps[] = [
  { name: "dashboard", icon: Home, url: "/dashboard" },
] as const;

export const maintenanceLinks: MaintenanceItemProps[] = [
  { name: "create request", icon: Wrench, url: "/maintenance-request" },
  { name: "view requests", icon: File, url: "/maintenance-list" },
] as const;

export const assetLinks: assetItemProps[] = [
  { name: "asset register", icon: Library, url: "/asset" },
  { name: "asset", icon: File, url: "/asset/${id}" },
] as const;

export const PreferencesLinks: PreferencesLinksProps[] = [
  { name: "Settings", icon: Settings, url: "/settings" },
  { name: "Profile", icon: User2, url: "profile" },
];

export const AuthLinks: AuthLinks[] = [{ name: "Logout", icon: LogOut }];
