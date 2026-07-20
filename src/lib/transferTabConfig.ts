import {
  ClipboardList,
  UserCircle,
  Wrench,
  Banknote,
  type LucideIcon,
} from "lucide-react";

/**
 * Available tab keys for the tab navigation system.
 *
 * Each value represents a distinct section of the UI.
 */
export type Tab = "request" | "in-transit" | "completed" | "costs";

/**
 * Configuration for UI tabs used in navigation components.
 *
 * Each tab defines:
 * - `key`: internal identifier used for state/control logic
 * - `label`: user-facing display text
 * - `icon`: Lucide icon component rendered in the UI
 * 
 * @example 
 * ```tsx
 * import { TAB_CONFIG, type Tab } from "./TAB_CONFIG";
 * import { useState } from "react";
 * 
 * export function Tabs() {
 *   const [activeTab, setActiveTab] = useState<Tab>("request");
 * 
 *   return (
 *     <div className="flex gap-3">
 *       {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
 *         <button
 *           key={key}
 *           onClick={() => setActiveTab(key)}
 *           className={`flex items-center gap-2 px-3 py-2 rounded ${
 *             activeTab === key ? "bg-gray-200" : ""
 *           }`}
 *         >
 *           <Icon className="w-4 h-4" />
 *           <span>{label}</span>
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
  ```
 */
export const TAB_CONFIG: {
  key: Tab;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: "request",
    label: "Request",
    icon: ClipboardList,
  },
  {
    key: "in-transit",
    label: "Transit",
    icon: UserCircle,
  },
  {
    key: "completed",
    label: "Received",
    icon: Wrench,
  },
  {
    key: "costs",
    label: "Costs",
    icon: Banknote,
  },
];
