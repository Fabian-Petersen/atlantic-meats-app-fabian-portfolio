// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import { cn } from "@/lib/utils";
import FormHeading from "../../customComponents/FormHeading";
import CreateAssetForm from "@/components/assets/CreateAssetForm";
import { sharedStyles } from "@/styles/shared";

const CreateAssetPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          className={cn(sharedStyles.headingForm)}
          heading="Create Asset"
        />
        <CreateAssetForm />
      </div>
    </div>
  );
};

export default CreateAssetPage;
