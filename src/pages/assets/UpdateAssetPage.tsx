// $ This page renders when a user updates an asset

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import UpdateAssetForm from "@/components/assets/UpdateAssetForm";

const UpdateAssetPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <UpdateAssetForm />
      </div>
    </div>
  );
};

export default UpdateAssetPage;
