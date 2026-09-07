// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import BackButton from "@/components/features/BackButton";
import MobileDisposalsItemDetails from "@/components/mobile/disposals/MobileDisposalsItemDetails";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useParams } from "react-router-dom";
import DisposalItemDetails from "@/components/disposals/DisposalItemDetails";

const DisposalItemPage = () => {
  const { id: disposalId } = useParams<{
    id: string;
  }>();

  const { data: item, isPending } = useById<DisposalWorkflowResponse>({
    id: disposalId ?? "",
    queryKey: ["disposal", "status: all"],
    resourcePath: "api/disposals",
  });

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  if (!item) {
    return <p>Asset Disposal not found</p>;
  }

  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden">
        <BackButton
          to={`/disposals/requests`}
          parentStyles="flex-none"
          label="Back"
        />
        <DisposalItemDetails item={item} />
      </div>
      <MobileDisposalsItemDetails item={item} />
    </div>
  );
};

export default DisposalItemPage;
