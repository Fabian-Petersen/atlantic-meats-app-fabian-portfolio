import {
  // DollarSign,
  File,
  // FileText,
  Home,
  Info,
  LogOut,
  // LucideIcon,
  Settings,
  User2,
  // Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  { name: "request", icon: File, url: "/maintenance-request" },
  { name: "list", icon: Info, url: "/maintenance-list" },
] as const;

export const assetLinks: assetItemProps[] = [
  { name: "asset register", icon: Home, url: "/asset-register" },
  { name: "asset", icon: File, url: "/asset/${id}" },
] as const;

export const PreferencesLinks: PreferencesLinksProps[] = [
  { name: "Settings", icon: Settings, url: "/settings" },
  { name: "Profile", icon: User2, url: "profile" },
];

export const AuthLinks: AuthLinks[] = [{ name: "Logout", icon: LogOut }];
