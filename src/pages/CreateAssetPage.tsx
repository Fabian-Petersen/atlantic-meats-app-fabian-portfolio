// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import FormHeading from "../../customComponents/FormHeading";
import CreateAssetForm from "@/components/assets/CreateAssetForm";

const CreateAssetPage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border">
        <FormHeading className="" heading="Create Asset" />
        <CreateAssetForm />
      </div>
    </div>
  );
};

export default CreateAssetPage;
