import FormHeading from "@/components/customComponents/FormHeading";
import CreateJobForm from "@/components/maintenance/CreateJobForm";

const CreateJob = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex flex-col gap-8 w-full max-w-100 bg-white h-auto rounded-xl shadow-lg p-4">
        <FormHeading heading="Create Maintenance Query" />
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJob;
