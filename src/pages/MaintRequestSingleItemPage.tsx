// $ This page renders the full details of a maintenance request information with the supporting pictures

import { useParams } from "react-router-dom";
import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

const MaintRequestSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"
  console.log(item);

  if (!id || !item) {
    return <p>Cannot find what you are looking for</p>;
  }

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <div>
      <h1>Maintenance Item {item.id}</h1>
      <p>Store: {item.store}</p>
      <p>Priority: {item.priority}</p>
      <p>Description: {item.description}</p>
      {/* Render other fields as needed */}
    </div>
  );
};

export default MaintRequestSingleItemPage;
