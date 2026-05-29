import Separator from "@/components/dashboardSidebar/Seperator";
import type { AssetAPIResponse } from "@/schemas";

import UpdateAssetDialog from "../modals/UpdateAssetDialog";

type Props = {
  item: AssetAPIResponse;
};

function AssetSingleItemInfo({ item }: Props) {
  return (
    <div className="flex gap flex-col text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50 h-full">
      <UpdateAssetDialog />
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-sm text-xs">
        <li className="capitalize flex gap-2">
          <span className="">Asset ID : </span>
          <span>{item.assetID}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span className="">Business Unit : </span>
          <span>{item.business_unit}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span className="">Area : </span>
          <span>{item.area}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Condition : </span>
          <span>{item.condition}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Location : </span>
          <span>{item.location}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Serial Number : </span>
          <span>{item.serialNumber}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Comments : </span>
          <span>{item.additional_notes}</span>
        </li>
      </ul>
    </div>
  );
}

export default AssetSingleItemInfo;
