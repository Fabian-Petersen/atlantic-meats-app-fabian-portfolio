// $ This is a generic component that handles the actions a table require. Each table can pass the actions it needs.

import {
  Pencil,
  Trash2Icon,
  Wrench,
  MessageSquare,
  DownloadIcon,
  type LucideIcon,
} from "lucide-react";

import type { Resource } from "@/utils/api";
import type { JobcardPresignedUrlResponse } from "@/schemas";

export type TableActionLinks = {
  id: string;
  label: string;
  icon: LucideIcon;
  url?: string;
  onClick: () => void | Promise<void>;
};

type DeleteConfig = {
  resourcePath: Resource;
  queryKey: readonly unknown[];
};

type GetTableMenuItemsProps = {
  rowId: string;
  setSelectedRowId: (id: string) => void;

  edit?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  action?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  delete?: {
    label?: string;
    onDelete: (
      id: string,
      config: { resourcePath: Resource; queryKey: readonly unknown[] },
    ) => void;
    config: DeleteConfig;
  };

  download?: {
    label?: string;
    url?: string;
    onDownload: (id: string) => Promise<JobcardPresignedUrlResponse> | void;
  };

  comments?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };
};

export const getTableMenuItems = ({
  rowId,
  setSelectedRowId,
  edit,
  action,
  delete: deleteAction,
  download,
  comments,
}: GetTableMenuItemsProps): TableActionLinks[] => {
  const items: TableActionLinks[] = [];

  if (edit) {
    items.push({
      id: "edit",
      label: edit.label ?? "Edit",
      icon: Pencil,
      url: edit.url,
      onClick: () => {
        setSelectedRowId(rowId);
        edit.onOpen();
      },
    });
  }

  if (action) {
    items.push({
      id: "action",
      label: action.label ?? "Action",
      icon: Wrench,
      url: action.url,
      onClick: () => {
        setSelectedRowId(rowId);
        action.onOpen();
      },
    });
  }

  if (deleteAction) {
    items.push({
      id: "delete",
      label: deleteAction.label ?? "Delete",
      icon: Trash2Icon,
      onClick: () => {
        setSelectedRowId(rowId);
        deleteAction.onDelete(rowId, deleteAction.config);
      },
    });
  }

  if (download) {
    items.push({
      id: "download",
      label: download.label ?? "Download",
      icon: DownloadIcon,
      url: download.url,
      onClick: () => {
        download.onDownload(rowId);
      },
    });
  }

  if (comments) {
    items.push({
      id: "comments",
      label: comments.label ?? "Comments",
      icon: MessageSquare,
      url: comments.url,
      onClick: () => {
        setSelectedRowId(rowId);
        comments.onOpen();
      },
    });
  }

  return items;
};
