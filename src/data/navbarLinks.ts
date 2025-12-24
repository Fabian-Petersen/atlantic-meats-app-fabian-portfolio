import {
  // DollarSign,
  File,
  FileText,
  Home,
  Info,
  LogOut,
  // LucideIcon,
  Settings,
  User2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItemProps = {
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

export const navbarLinks: NavItemProps[] = [
  { name: "dashboard", icon: Home, url: "/dashboard" },
  { name: "request service", icon: File, url: "/request-service" },
  { name: "asset register", icon: FileText, url: "/asset-register" },
  { name: "store KPI", icon: Users, url: "/store-kpi" },
  { name: "service list", icon: Info, url: "/service-list" },
] as const;

export const PreferencesLinks: PreferencesLinksProps[] = [
  { name: "Settings", icon: Settings, url: "/settings" },
  { name: "Profile", icon: User2, url: "profile" },
];

export const AuthLinks: AuthLinks[] = [{ name: "Logout", icon: LogOut }];
