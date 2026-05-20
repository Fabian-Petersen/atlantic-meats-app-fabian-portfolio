import { MetricCardItem } from "./MetricsCardItem";
import type { CardData, MetricValues } from "@/schemas/dashboardSchema";

export interface MetricCardConfig {
  cardData: CardData;
  metrics: MetricValues;
}

interface CardContainerProps {
  cards: MetricCardConfig[];
  isPending?: boolean;
}

const CardContainer = ({ cards, isPending = false }: CardContainerProps) => {
  return (
    <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {cards.map((card, index) => (
        <MetricCardItem
          key={index}
          cardData={card.cardData}
          metrics={card.metrics}
          isPending={isPending}
        />
      ))}
    </div>
  );
};

export default CardContainer;
