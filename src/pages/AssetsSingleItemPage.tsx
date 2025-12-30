// $ This page renders the full details of a maintenance request information with the supporting pictures

import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/maintenanceRequests";

import type { AssetFormValues } from "@/schemas";

const ASSETS_KEY = ["assets"];

const AssetsSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  //   const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"

  const { data: item, isLoading } = useById<AssetFormValues>({
    id: id || "",
    queryKey: ASSETS_KEY,
    endpoint: "/asset",
  });

  console.log(item);

  if (!id || !item) {
    return (
      <p className="h-full flex justify-center items-center dark:text-gray-200 text-font">
        Cannot find what you are looking for
      </p>
    );
  }

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="dark:text-gray-100 p-4">
      <h1>Asset Item {item.id}</h1>
      <p>Description: {item.description}</p>
      <p>Location: {item.location}</p>
      <p>warranty: {item.warranty}</p>
      <p>createdAt: {item.createdAt}</p>
      {/* Render other fields as needed */}
    </div>
  );
};

export default AssetsSingleItemPage;
