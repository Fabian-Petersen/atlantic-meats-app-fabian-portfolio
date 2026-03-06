import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { CardItem } from "@/schemas/dashboardSchema";

export const MetricCardItem = <T extends string>({
  cardData,
  metrics,
}: CardItem<T>) => {
  return (
    <>
      {cardData.map((card) => {
        const metric = metrics[card.id];

        return (
          <div key={card.id} className="w-full relative">
            <div
              className="
                flex flex-col justify-between
                gap-2 xl:gap-3 w-full
                rounded-md shadow-md
                bg-white dark:bg-[#1d2739]
                text-gray-600 dark:text-white
                p-[0.325rem] xl:p-2
                border border-white dark:border-[rgba(55,65,81,0.5)]
              "
            >
              <div className="p-1">
                <p className="capitalize text-xs md:text-sm">{card.title}</p>
                <p className="text-[2rem] md:text-[2.5rem]">{metric.value}</p>
              </div>

              <div
                className={`
                  flex items-center gap-2 self-end w-full
                  text-[0.625rem] xl:text-[0.825rem]
                  ${metric.valueChange === 0 ? "text-blue-600" : metric.valueChange > 0 ? "text-green-500" : "text-red-500"}
                `}
              >
                {metric.valueChange === 0 ? undefined : metric.valueChange >
                  0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}

                <span>
                  {metric.valueChange}%{" "}
                  <span className="opacity-80">Change from last month</span>
                </span>
              </div>
            </div>

            <div
              className="flex items-center justify-center absolute size-18 top-1/2 right-[5%] -translate-y-1/2 rounded-full p-2 xl:p-3 border border-white"
              style={{
                color: card.color,
                backgroundColor: card.bgColor,
              }}
            >
              {React.createElement(card.icon, { size: 28 })}
            </div>
          </div>
        );
      })}
    </>
  );
};
