import type { NavigateFunction } from "react-router-dom";

import type { DeleteConfig } from "@/context/app-types";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type GetAssetMenuItemsOptions = {
  rowId: string;
  setSelectedRowId: (id: string) => void;
  setShowManualVerificationDialog: (open: boolean) => void;
  openDeleteDialog: (id: string, config: DeleteConfig) => void;
  navigate: NavigateFunction;
};

export const getAssetMenuItems = ({
  rowId,
  setSelectedRowId,
  setShowManualVerificationDialog,
  openDeleteDialog,
  navigate,
}: GetAssetMenuItemsOptions) =>
  getTableMenuItems({
    rowId,
    setSelectedRowId,
    order: [
      "view",
      "edit",
      "history",
      "verify",
      "manual-verification",
      "delete",
    ],
    view: {
      url: `/assets/${rowId}`,
      onOpen: () => navigate(`/assets/${rowId}`),
    },
    edit: {
      url: `/assets/${rowId}/update-asset`,
      onOpen: () => navigate(`/assets/${rowId}/update-asset`),
    },
    history: {
      url: `/assets/${rowId}/history`,
      config: {
        resourcePath: `api/assets/${rowId}/history`,
        queryKey: ["assets", "asset-history"],
        resourceName: "asset",
      },
      onOpen: () => navigate(`/assets/${rowId}/history`),
    },
    verify: {
      url: "/assets/verification",
      onOpen: () => navigate("/assets/verification"),
    },
    manualVerification: {
      url: "/assets/verification/manual",
      onOpen: () => {
        setShowManualVerificationDialog(true);
        navigate("/assets/verification/manual");
      },
    },
    delete: {
      config: {
        resourcePath: "api/assets",
        queryKey: ["assets", "list"],
        resourceName: "asset",
      },
      onDelete: openDeleteDialog,
    },
  });
