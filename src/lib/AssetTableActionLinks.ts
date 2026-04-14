// $ This component manage the logic of the asset table action links.

import type { Resource } from "@/utils/api";
import type { TableActionLinks } from "./JobTableActionLinks";

import { Pencil, Trash2Icon, Cog } from "lucide-react";

export const getAssetTableMenuItems = (
  rowId: string,
  setSelectedRowId: (id: string) => void,
  setShowUpdateAssetDialog: (v: boolean) => void,
  openDeleteDialog: (
    id: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
): TableActionLinks[] => [
  {
    id: "1",
    label: "Edit",
    icon: Pencil,
    onClick: () => {
      setShowUpdateAssetDialog(true);
      setSelectedRowId(rowId);
    },
  },
  {
    id: "2",
    label: "History",
    icon: Cog,
    onClick: () => {
      setSelectedRowId(rowId);
    },
  },
  {
    id: "3",
    label: "Delete",
    icon: Trash2Icon,
    onClick: () => {
      openDeleteDialog(rowId, {
        resourcePath: "assets-data",
        queryKey: ["getAssetsList", "deleteAsset"] as const,
      });
    },
  },
];
