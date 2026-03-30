import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { CardItem } from "@/schemas/dashboardSchema";
import { SkeletonCard } from "./SkeletonCard";

type Props = {
  isPending?: boolean;
};
export const MetricCardItem = <T extends string>({
  cardData,
  metrics,
  isPending,
}: CardItem<T> & Props) => {
  return (
    <>
      {isPending
        ? cardData.map((card) => <SkeletonCard key={card.id} />)
        : cardData.map((card) => {
            const metric = metrics[card.id];
            return (
              <div key={card.id} className="w-full relative">
                <div className="flex flex-col justify-between gap-2 w-full rounded-md shadow-md bg-white dark:bg-(--bg-primary_dark) text-gray-600 dark:text-white p-[0.325rem] xl:p-1.5 border border-white dark:border-[rgba(55,65,81,0.5)]">
                  <div className="p-1">
                    <p className="capitalize text-xs lg:text-sm">
                      {card.title}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[2rem] md:text-[2.5rem]">
                        {metric.value}
                      </p>
                      <div
                        className="flex items-center justify-center size-8 lg:size-12 rounded-full p-2 xl:p-3 border border-white dark:border-none"
                        style={{
                          color: card.color,
                          backgroundColor: card.bgColor,
                        }}
                      >
                        {React.createElement(card.icon, { size: 28 })}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`
                  flex items-center gap-2 self-end w-full
                  text-[0.525rem] lg:text-[0.725rem]
                  ${metric.valueChange === 0 ? "text-blue-600" : metric.valueChange > 0 ? "text-green-500" : "text-red-500"}
                `}
                  >
                    {metric.valueChange === 0 ? undefined : metric.valueChange >
                      0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}

                    <span className="text-[0.625rem] lg:text-[0.725rem]">
                      {metric.valueChange}%{" "}
                      <span className="lg:text-[0.725rem] opacity-80">
                        from last month
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
    </>
  );
};
