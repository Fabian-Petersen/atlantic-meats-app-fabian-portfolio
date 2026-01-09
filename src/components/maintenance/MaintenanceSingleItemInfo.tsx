import Separator from "@/components/dashboardSidebar/Seperator";
import type { CreateJobFormValues } from "@/schemas";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  item: CreateJobFormValues;
};

function MaintenanceSingleItemInfo({ item }: Readonly<Props>) {
  const { setData } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className="flex gap flex-col gap-2 text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50">
      <h1 className="text-lg md:text-2xl">Asset : {item.equipment}</h1>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-md text-sm">
        <li className="capitalize flex gap-2">
          <span className="">Request ID : </span>
          <span>{item.id}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Store : </span>
          <span>{item.store}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Type : </span>
          <span>{item.type}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Impact : </span>
          <span>{item.impact}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Priority : </span>
          <span>{item.priority}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Additional Notes : </span>
          <span>{item.additional_notes}</span>
        </li>
      </ul>
      <div className="flex w-full justify-end pt-6">
        <div className="flex gap-4 w-1/2">
          <Button
            type="button"
            onClick={() => {
              navigate("/maintenance-list");
            }}
            variant="cancel"
            size="xl"
            className="flex-1 bg-transparent border border-red-500 text-gray-600"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="submit"
            size="xl"
            className="flex-1"
            onClick={() => {
              setData(item);
              navigate(`/maintenance-action/${item.id}`);
            }}
          >
            Action
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceSingleItemInfo;
