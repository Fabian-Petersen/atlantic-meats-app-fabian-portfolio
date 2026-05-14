import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

import { MetricCardItem } from "./MetricsCardItem";

const Cards = () => {
  const { cards, isPending } = useDashboardMetrics();

  if (!cards.length) return null;

  return (
    <div
      className="
        grid w-full
        grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4
      "
    >
      {cards.map((card) => (
        <MetricCardItem
          key={card.cardData.id}
          cardData={card.cardData}
          metrics={card.metrics}
          isPending={isPending}
        />
      ))}
    </div>
  );
};

export default Cards;
