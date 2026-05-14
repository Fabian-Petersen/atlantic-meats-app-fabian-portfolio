import React from "react";
import { SkeletonCard } from "./SkeletonCard";
import type { MetricCardConfig } from "@/schemas/dashboardSchema";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatPercentage } from "@/utils/percentageFormatter";
import { cn } from "@/lib/utils";

type Props = MetricCardConfig & {
  isPending?: boolean;
};
export const MetricCardItem = ({ cardData, metrics, isPending }: Props) => {
  return (
    <>
      {isPending ? (
        <SkeletonCard key={cardData.id} />
      ) : (
        (() => {
          const isPositive = metrics.valueChange > 0;
          const isNegative = metrics.valueChange < 0;
          const isNeutral = metrics.valueChange === 0;

          const trendColor = isNeutral
            ? "text-blue-600"
            : isPositive
              ? "text-green-500"
              : "text-red-500";

          return (
            <div key={cardData.id} className="w-full relative">
              <div
                className={cn(
                  "flex flex-col justify-between gap-2 w-full rounded-md shadow-md",
                  "bg-white dark:bg-(--bg-primary_dark) text-gray-600 dark:text-white",
                  "p-[0.325rem] xl:p-1.5 border border-white",
                  "dark:border-[rgba(55,65,81,0.5)]",
                )}
              >
                <div className="p-1">
                  <p className="capitalize text-xs lg:text-sm">
                    {cardData.title}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-[2rem] md:text-[2.5rem]">
                      {metrics.value}
                    </p>

                    <div
                      className="
                          flex items-center justify-center
                          size-8 lg:size-12
                          rounded-full p-2 xl:p-3
                          border border-white dark:border-none
                        "
                      style={{
                        color: cardData.color,
                        backgroundColor: cardData.bgColor,
                      }}
                    >
                      {React.createElement(cardData.icon, {
                        size: 28,
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className={`
                      flex items-center gap-2 self-end w-full
                      text-[0.525rem] lg:text-[0.725rem]
                      ${trendColor}
                    `}
                >
                  {isPositive && <TrendingUp size={16} />}

                  {isNegative && <TrendingDown size={16} />}

                  {isNeutral && <Minus size={16} />}

                  <span className="text-[0.625rem] lg:text-[0.725rem]">
                    {formatPercentage(metrics.valueChange)}%
                    <span className="lg:text-[0.725rem] opacity-80">
                      {" "}
                      from last month
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </>
  );
};
