import { cn } from "@/lib/utils";
import CreateDisposalForm from "@/components/disposals/CreateDisposalForm";
import { sharedStyles } from "@/styles/shared";

const CreateDisposalPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateDisposalForm />
      </div>
    </div>
  );
};

export default CreateDisposalPage;
