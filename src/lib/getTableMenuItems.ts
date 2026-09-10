// $ This is a generic component that handles the actions a table require. Each table can pass the actions it needs.

import {
  Pencil,
  Trash2Icon,
  Wrench,
  Mail,
  MessageSquare,
  DownloadIcon,
  User,
  type LucideIcon,
  History,
  Truck,
  ArchiveX,
  Eye,
  CheckCircle,
} from "lucide-react";

import type { Resource } from "@/utils/api";
import type { JobcardPresignedUrlResponse } from "@/schemas";
import type { DeleteConfig } from "@/context/app-types";

export type TableActionLinks = {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  url?: string;
  onClick: () => void | Promise<void>;
};

export const tableActionStyles: Record<
  string,
  Pick<TableActionLinks, "color" | "bgColor">
> = {
  create: {
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/50",
  },
  action: {
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/50",
  },
  history: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
  },
  receipt: {
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/50",
  },
  approve: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  reject: {
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/50",
  },
  transit: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  dispose: {
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
  },
  edit: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  view: {
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-950/50",
  },
  delete: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/50",
  },
  download: {
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
  },
  comments: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  resend: {
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950/50",
  },
};

type GetTableMenuItemsProps = {
  rowId: string;
  request_id?: string;
  userStatus?: string;
  status?: string;
  setSelectedRowId: (id: string) => void;

  create?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  approve?: {
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

  view?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  transit?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  dispose?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  receipt?: {
    label?: string;
    url?: string;
    onOpen: () => void;
  };

  history?: {
    label?: string;
    url?: string;
    onOpen: () => void;
    config: DeleteConfig; // Change to its own config if needed
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

  resend?: {
    label?: string;
    url?: string;
    onResend: (id: string) => Promise<void> | void;
  };
};

export const getTableMenuItems = ({
  rowId,
  request_id,
  status,
  setSelectedRowId,
  approve,
  edit,
  view,
  transit,
  receipt,
  action,
  create,
  delete: deleteAction,
  download,
  comments,
  resend,
  userStatus,
  history,
  dispose,
}: GetTableMenuItemsProps): TableActionLinks[] => {
  const items: TableActionLinks[] = [];

  if (create) {
    items.push({
      id: "create",
      label: create.label ?? "Create",
      icon: User,
      ...tableActionStyles.create,
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
      ...tableActionStyles.action,
      url: action.url,
      onClick: () => {
        setSelectedRowId(rowId);
        action.onOpen();
      },
    });
  }

  if (history) {
    items.push({
      id: "history",
      label: history.label ?? "History",
      icon: History,
      ...tableActionStyles.history,
      url: history.url,
      onClick: () => {
        setSelectedRowId(rowId);
        history.onOpen();
      },
    });
  }
  if (receipt) {
    items.push({
      id: "receipt",
      label: receipt.label ?? "Receipt",
      icon: Truck,
      ...tableActionStyles.receipt,
      url: receipt.url,
      onClick: () => {
        setSelectedRowId(rowId);
        receipt.onOpen();
      },
    });
  }

  if (approve && status === "pending") {
    items.push({
      id: "approve",
      label: approve.label ?? "Approve",
      icon: CheckCircle,
      ...tableActionStyles.approve,
      url: approve.url,
      onClick: () => {
        setSelectedRowId(rowId);
        approve.onOpen();
      },
    });
  }

  if (transit && status === "approved") {
    items.push({
      id: "transit",
      label: transit.label ?? "Transit",
      icon: Truck,
      ...tableActionStyles.transit,
      url: transit.url,
      onClick: () => {
        setSelectedRowId(rowId);
        transit.onOpen();
      },
    });
  }

  if (dispose && status === "approved") {
    items.push({
      id: "dispose",
      label: dispose.label ?? "Dispose",
      icon: ArchiveX,
      ...tableActionStyles.dispose,
      url: dispose.url,
      onClick: () => {
        setSelectedRowId(rowId);
        dispose.onOpen();
      },
    });
  }

  if (edit) {
    items.push({
      id: "edit",
      label: edit.label ?? "Edit",
      icon: Pencil,
      ...tableActionStyles.edit,
      url: edit.url,
      onClick: () => {
        setSelectedRowId(rowId);
        edit.onOpen();
      },
    });
  }

  if (view) {
    items.push({
      id: "view",
      label: view.label ?? "View",
      icon: Eye,
      ...tableActionStyles.view,
      url: view.url,
      onClick: () => {
        setSelectedRowId(rowId);
        view.onOpen();
      },
    });
  }

  if (deleteAction) {
    items.push({
      id: "delete",
      label: deleteAction.label ?? "Delete",
      icon: Trash2Icon,
      ...tableActionStyles.delete,
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
      ...tableActionStyles.download,
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
      ...tableActionStyles.comments,
      url: comments.url,
      onClick: () => {
        if (request_id)
          setSelectedRowId(request_id); // the actions rowId is not eq to requestId for the comments
        else setSelectedRowId(rowId);
        comments.onOpen();
      },
    });
  }

  if (resend && userStatus === "FORCE_CHANGE_PASSWORD") {
    items.push({
      id: "resend",
      label: resend.label ?? "Resend Password",
      icon: Mail,
      ...tableActionStyles.resend,
      url: resend.url,
      onClick: () => {
        setSelectedRowId(rowId);
        resend.onResend(rowId);
      },
    });
  }

  return items;
};
