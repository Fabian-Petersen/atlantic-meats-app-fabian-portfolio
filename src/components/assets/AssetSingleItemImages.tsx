import type { AssetFormValues } from "@/schemas";
import { useState } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import {} from "../../../public/images/20251124_150123.jpg";

type Props = {
  item: AssetFormValues;
};

export const AssetSingleItemImages = ({ item }: Props) => {
  console.log(item);
  //   const images = item.images; // string[] (urls)
  const images = [
    "/images/20251124_121905.jpg",
    "/images/20251124_121924.jpg",
    "/images/20251124_121928.jpg",
    "/images/20251124_150109.jpg",
    "/images/20251124_150123.jp",
  ];
  const MAX_VISIBLE = 3;

  const [activeIndex, setActiveIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const visibleImages = images.slice(startIndex, startIndex + MAX_VISIBLE);

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + MAX_VISIBLE < images.length;

  return (
    <div className="bg-gray-100 grid grid-rows-[25rem_8rem] md:grid-rows-[30rem_12rem] gap-2 rounded-md dark:border-gray-700/50 dark:bg-[#1d2739] p-2 h-full">
      {/* Main Image */}
      <div className="rounded-md h-full w-full flex items-center justify-center overflow-hidden">
        <img
          src={images[activeIndex]}
          className="object-cover h-full w-full"
          alt="Active"
        />
      </div>

      {/* Thumbnails */}
      <div className="relative flex items-center gap-2 h-32 md:h-48 group">
        {/* Left Scroll */}
        {canScrollLeft && (
          <button
            onClick={() => setStartIndex((prev) => prev - 1)}
            className="absolute px-2 hover:cursor-pointer top-1/2 left-[2%] -translate-y-1/2"
          >
            <ChevronLeftCircle
              size={36}
              className=" text-white"
              fill="var(--chevron)"
            />
          </button>
        )}

        <div className="grid grid-cols-3 gap-2 h-full w-full">
          {visibleImages.map((img, index) => {
            const actualIndex = startIndex + index;
            return (
              <div
                key={img}
                onClick={() => setActiveIndex(actualIndex)}
                className={`cursor-pointer bg-gray-200 rounded-md h-full w-full overflow-hidden ${
                  actualIndex === activeIndex ? "ring-2 ring-primary" : ""
                } ${index === 2 ? "group/thumb" : ""}`}
              >
                <img
                  src={img}
                  className="h-full w-full object-cover rounded-md"
                  alt=""
                />
              </div>
            );
          })}
        </div>

        {/* Right Scroll */}
        {canScrollRight && (
          <button
            onClick={() => setStartIndex((prev) => prev + 1)}
            className="absolute top-1/2 right-[2%] -translate-y-1/2 px-2
                 opacity-0 pointer-events-none hover:cursor-pointer
                 transition-opacity
                 group-hover:opacity-100
                 group-hover:pointer-events-auto"
          >
            <ChevronRightCircle
              size={36}
              className=" text-white"
              fill="var(--chevron)"
            />
          </button>
        )}
      </div>
    </div>
  );
};
