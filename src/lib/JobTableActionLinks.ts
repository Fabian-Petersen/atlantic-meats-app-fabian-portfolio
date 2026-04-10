// $ The functions that managed the actions committed by the dropdown menu items menu for the tables.

import {
  Pencil,
  Trash2Icon,
  Wrench,
  MessageSquare,
  type LucideIcon,
  DownloadIcon,
} from "lucide-react";

export type TableActionLinks = {
  label: string;
  id: string;
  icon: LucideIcon;
  url?: string;
  onClick: () => void | Promise<void>;
};

import type { Resource } from "@/utils/api";
import type { JobcardPresignedUrlResponse } from "@/schemas";

export const getMaintenanceTableMenuItems = (
  rowId: string,
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>,
  openDeleteDialog: (
    id: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
  setOpenChatSidebar: (v: boolean) => void,
): TableActionLinks[] => [
  {
    id: "1",
    url: "/update-request",
    label: "Edit",
    icon: Pencil,
    onClick: () => {
      setShowUpdateMaintenanceDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "2",
    url: "/jobs/actioned",
    label: "Action",
    icon: Wrench,
    onClick: () => {
      setShowActionDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "3",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => {
      openDeleteDialog(rowId, {
        resourcePath: "jobs/pending",
        queryKey: ["MAINTENANCE_DELETE_KEY"] as const,
      });
      setSelectedRowId(rowId);
    },
  },
  {
    id: "4",
    label: "Download",
    url: "/jobs/jobcard",
    icon: DownloadIcon,
    onClick: () => {
      downloadItem(rowId);
    },
  },
  {
    id: "5",
    label: "Comments",
    url: `/jobs/pending/${rowId}/comments`,
    icon: MessageSquare,
    onClick: () => {
      setOpenChatSidebar(true);
      setSelectedRowId(rowId);
      // console.log("comments-row", rowId);
      // console.log("comments-btn-clicked:", openChatSidebar);
    },
  },
];
