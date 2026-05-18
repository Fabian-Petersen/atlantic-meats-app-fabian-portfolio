import { getUserGroups } from "@/auth/getUserGroups";
import CardContainer from "@/components/dashboard/CardContainer";
import { useAssetJobsHistory } from "@/hooks/useAssetJobsHistory";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useEffect } from "react";
import FormHeading from "../../customComponents/FormHeading";

const AssetHistoryPage = () => {
  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  const { cards, isPending, barcode_id } = useAssetJobsHistory();

  return (
    <main className="w-full h-full md:p-4 p-2">
      <FormHeading
        heading={`Asset History - Equipment ${barcode_id}`}
        className={cn(sharedStyles.headingTable)}
      />
      <section className={cn(sharedStyles.dashboardCardsParent)}>
        <CardContainer cards={cards} isPending={isPending} />
      </section>
      <section></section>
    </main>
  );
};

export default AssetHistoryPage;
