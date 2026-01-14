import Separator from "@/components/dashboardSidebar/Seperator";
import type { AssetFormValues } from "@/schemas";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import UpdateAssetDialog from "../modals/UpdateAssetDialog";

type Props = {
  item: AssetFormValues;
};

function AssetSingleItemInfo({ item }: Props) {
  const navigate = useNavigate();
  const { setGenericData, setShowUpdateAssetDialog } = useGlobalContext();
  return (
    <div className="flex gap flex-col text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50">
      <UpdateAssetDialog />
      <h1 className="text-lg md:text-2xl">Asset : {item.equipment}</h1>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-md text-sm">
        <li className="capitalize flex gap-2">
          <span className="">Asset ID : </span>
          <span>{item.assetID}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span className="">Business Unit : </span>
          <span>{item.business_unit}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span className="">Category : </span>
          <span>{item.category}</span>
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
      <div className="flex w-full justify-end pt-6">
        <div className="flex gap-4 w-full md:w-1/2">
          <Button
            type="button"
            onClick={() => {
              navigate("/asset");
            }}
            variant="cancel"
            size="xl"
            className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="submit"
            size="xl"
            className="flex-1"
            onClick={() => {
              setGenericData(item);
              setShowUpdateAssetDialog(true);
            }}
          >
            Edit Asset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AssetSingleItemInfo;
