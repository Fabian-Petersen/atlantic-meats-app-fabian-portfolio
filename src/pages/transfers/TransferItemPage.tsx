// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import type { TransferWorkflowResponse } from "@/schemas";
import BackButton from "@/components/features/BackButton";
// import MobileCompletedJobDetails from "@/components/mobile/MobileCompletedJobDetails";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useParams } from "react-router-dom";
import TransferItemDetails from "@/components/transfers/TransferItemDetails";

const TransferItemPage = () => {
  const { id: transferId } = useParams<{ id: string }>();

  const { data: item, isPending } = useById<TransferWorkflowResponse>({
    id: transferId ?? "",
    queryKey: ["transfer", "status: all"],
    resourcePath: "api/transfers",
    params: { status: "in-transit" },
  });

  // console.log("data-item:", item);

  const status = item?.status;

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  if (!item) {
    return <p>Asset Transfer not found</p>;
  }

  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden">
        <BackButton
          to={`/transfers/${status}`}
          parentStyles="flex-none"
          label="Transfers"
        />
        <TransferItemDetails item={item} />
      </div>
      {/* <MobileCompletedJobDetails item={item} /> */}
    </div>
  );
};

export default TransferItemPage;
