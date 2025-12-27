import { useParams } from "react-router-dom";
import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

const MaintenanceListItemPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: item } = useMaintenanceRequestById(id || "");

  if (!id || !item) {
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

export default MaintenanceListItemPage;
