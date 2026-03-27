// $ This is a generic component that handles the actions a table require. Each table can pass the actions it needs.

import {
  Pencil,
  Trash2Icon,
  Wrench,
  MessageSquare,
  DownloadIcon,
  User,
  type LucideIcon,
} from "lucide-react";

import type { Resource } from "@/utils/api";
import type { JobcardPresignedUrlResponse } from "@/schemas";
import type { DeleteConfig } from "@/context/app-types";

export type TableActionLinks = {
  id: string;
  label: string;
  icon: LucideIcon;
  url?: string;
  onClick: () => void | Promise<void>;
};

// type DeleteConfig = {
//   resourcePath: Resource;
//   queryKey: readonly unknown[];
// };

type GetTableMenuItemsProps = {
  rowId: string;
  request_id?: string;
  setSelectedRowId: (id: string) => void;

  create?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  action?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  edit?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  delete?: {
    label?: string;
    onDelete: (
      id: string,
      config: {
        resourcePath: Resource;
        queryKey: readonly unknown[];
        resourceName?: string;
      },
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
  request_id,
  setSelectedRowId,
  edit,
  action,
  create,
  delete: deleteAction,
  download,
  comments,
}: GetTableMenuItemsProps): TableActionLinks[] => {
  const items: TableActionLinks[] = [];

  if (create) {
    items.push({
      id: "create",
      label: create.label ?? "Create",
      icon: User,
      url: create.url,
      onClick: () => {
        setSelectedRowId(rowId);
        create.onOpen();
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
        if (request_id)
          setSelectedRowId(request_id); // the actions rowId is not eq to requestId for the comments
        else setSelectedRowId(rowId);
        comments.onOpen();
      },
    });
  }

  return items;
};
