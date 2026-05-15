import React from "react";
import { SkeletonCard } from "./SkeletonCard";
import type { MetricCardConfig } from "@/schemas/dashboardSchema";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatPercentage } from "@/utils/percentageFormatter";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

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
          const isPositive = (metrics.valueChange ?? 0) > 0;
          const isNegative = (metrics.valueChange ?? 0) < 0;
          const isNeutral = (metrics.valueChange ?? 0) === 0;

          const trendColor = isNeutral
            ? "text-blue-600"
            : isPositive
              ? "text-green-500"
              : "text-red-500";

          return (
            <div key={cardData.id} className="w-full relative">
              <div className={cn(sharedStyles.dashboardCard)}>
                <div className="p-1">
                  <p className="capitalize text-xs lg:text-sm">
                    {cardData.title}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-[2rem] md:text-[2.5rem]">
                      {metrics.value}
                    </p>

                    <div
                      className={cn(sharedStyles.dashboardCardIcon)}
                      style={{
                        color: cardData.color,
                        backgroundColor: cardData.bgColor,
                      }}
                    >
                      {React.createElement(cardData.icon, {
                        size: 36,
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
                  {metrics.valueChange ? (
                    <span className="text-[0.625rem] lg:text-[0.725rem]">
                      {formatPercentage(metrics.valueChange)}%
                      <span className="lg:text-[0.725rem] opacity-80">
                        {" "}
                        from last month
                      </span>
                    </span>
                  ) : (
                    <span className="text-[0.625rem] lg:text-[0.725rem]">
                      {0}%
                      <span className="lg:text-[0.725rem] opacity-80">
                        {" "}
                        from last month
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()
      )}
    </>
  );
};
