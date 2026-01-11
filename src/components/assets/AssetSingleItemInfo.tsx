import Separator from "@/components/dashboardSidebar/Seperator";
import type { AssetFormValues } from "@/schemas";

type Props = {
  item: AssetFormValues;
};

function AssetSingleItemInfo({ item }: Props) {
  return (
    <div className="flex gap flex-col text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50">
      <h1 className="text-lg md:text-2xl">Asset : {item.equipment}</h1>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-md text-sm">
        <li className="capitalize flex gap-2">
          <span className="">Asset ID : </span>
          <span>{item.assetID}</span>
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
      <div className="flex gap-4 md:w-1/2 w-full pt-8">
        <button
          onClick={() => alert("Edit Asset")}
          className="flex-1 rounded-full py-2 md:px-6 px-4 bg-blue-400 text-gray-100 hover:cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => alert("Delete Asset")}
          className="flex-1 rounded-full py-2 md:px-6 px-4 bg-red-400 text-gray-100 hover:cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AssetSingleItemInfo;
