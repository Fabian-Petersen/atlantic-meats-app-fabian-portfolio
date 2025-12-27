import FormHeading from "@/components/customComponents/FormHeading";
import MaintenanceRequestForm from "@/components/maintenance/MaintenanceRequestForm";

const MaintenanceRequestPage = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center w-full h-full p-4">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4">
        <FormHeading className="mx-auto" heading="Maintenance Request" />
        <MaintenanceRequestForm />
      </div>
    </div>
  );
};

export default MaintenanceRequestPage;
