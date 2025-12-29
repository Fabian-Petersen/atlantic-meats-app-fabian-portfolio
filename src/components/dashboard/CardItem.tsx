import React from "react";
import { dashboardCardData } from "@/data/dashboardCardData";
import { TrendingDown, TrendingUp } from "lucide-react";

const CardItem = () => {
  return (
    <>
      {dashboardCardData.map((card) => (
        <div key={card.id} className="w-full relative">
          <div
            className="
              flex flex-col justify-between
              gap-2 xl:gap-3 w-full
              rounded-md shadow-md
              bg-white dark:bg-[#1d2739]
              text-gray-600 dark:text-white
              p-[0.325rem] xl:p-2
              border-4 border-white dark:border-[rgba(55,65,81,0.5)]
            "
          >
            {/* Card Title & Value */}
            <div>
              <p className="capitalize text-[0.9rem] xl:text-base">
                {card.title}
              </p>
              <p className="text-[1.7rem] xl:text-2xl">
                {card.title === "total revenue" && (
                  <span className="mr-1">R</span>
                )}
                {card.value}
              </p>
            </div>

            {/* Card Trend Indicator */}
            <div
              className={`
                flex items-center gap-2 self-end w-full
                text-[0.625rem] xl:text-[0.825rem]
                ${card.valueChange > 0 ? "text-green-500" : "text-red-500"}
              `}
            >
              {card.valueChange > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {card.valueChange}%{" "}
                <span className="opacity-80">from last month</span>
              </span>
            </div>
          </div>

          {/* Card Icon */}
          <div
            className="absolute top-1/2 right-[5%] -translate-y-1/2 rounded-full p-2 xl:p-3 border border-white"
            style={{
              color: card.color,
              backgroundColor: card.bgColor,
            }}
          >
            {React.createElement(card.icon)}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardItem;
