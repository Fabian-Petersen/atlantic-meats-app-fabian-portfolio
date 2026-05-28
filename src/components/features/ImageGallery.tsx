import { useState } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
// import {} from "../../../public/images/20251124_150123.jpg";
import type { PresignedUrls } from "@/schemas/jobSchemas";
import NoImagePlaceholder from "../features/NoImagePlaceholder";

import FullscreenImageModal from "../modals/FullscreenImageModal";

type Props = {
  images: PresignedUrls[];
  className?: string;
};

export const ImageGallery = ({ images, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const MAX_VISIBLE = 3;

  const [activeIndex, setActiveIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const visibleImages = (images ?? []).slice(
    startIndex,
    startIndex + MAX_VISIBLE,
  );

  // Reserve the 4th slot for an overflow indicator if there are more images
  const overflowCount =
    images.length > MAX_VISIBLE + 1 ? images.length - MAX_VISIBLE : 0;

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + MAX_VISIBLE < images.length;

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-white p-2 rounded-md dark:border-gray-700/50 dark:bg-[#1d2739] h-full`}
      >
        <NoImagePlaceholder className="h-full min-h-100" />
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-white grid grid-rows-[25rem_5rem] md:grid-rows-[2fr_1fr] gap-3 rounded-md dark:border-gray-700/50 dark:bg-(--bg-primary_dark) h-full min-h-0`}
    >
      {/* Main Image */}
      <div className="relative rounded-md overflow-hidden min-h-0">
        <button
          type="button"
          aria-label="Open large image view"
          className="h-full w-full flex items-center justify-center overflow-hidden hover:cursor-zoom-in"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={images[activeIndex]?.url}
            className="object-cover h-full w-full transition-opacity duration-200"
            alt={images[activeIndex]?.filename}
          />
        </button>

        {/* Photo count badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {isOpen && (
        <FullscreenImageModal
          images={images.map((img) => img.url)}
          setIsOpen={setIsOpen}
          activeIndex={activeIndex}
        />
      )}

      {/* Thumbnails */}
      <div className="relative flex items-center gap-2 h-full group min-h-0">
        {/* Left Scroll */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => setStartIndex((prev) => prev - 1)}
            aria-label="Scroll left"
            title="Scroll left"
            className="absolute z-10 hover:cursor-pointer top-1/2 left-[1%] -translate-y-1/2"
          >
            <ChevronLeftCircle
              size={30}
              className="text-white drop-shadow-md"
              fill="var(--chevron)"
            />
          </button>
        )}

        <div className="grid grid-cols-4 gap-2 h-full w-full">
          {/* Visible thumbnails */}
          {visibleImages.map((img, index) => {
            const actualIndex = startIndex + index;
            return (
              <button
                type="button"
                aria-label={`View image ${actualIndex + 1}`}
                key={actualIndex}
                onClick={() => setActiveIndex(actualIndex)}
                className={`cursor-pointer bg-gray-200 rounded-md h-full w-full overflow-hidden transition-all duration-150 ${
                  actualIndex === activeIndex
                    ? "ring-2 ring-primary ring-offset-1"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  className="h-full w-full object-cover rounded-md"
                  alt={img.filename}
                />
              </button>
            );
          })}

          {/* Overflow indicator slot — shows when there are more images beyond MAX_VISIBLE */}
          {overflowCount > 0 ? (
            <button
              type="button"
              aria-label={`View ${overflowCount} more images`}
              onClick={() => setStartIndex((prev) => prev + 1)}
              className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md h-full w-full overflow-hidden flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              +{overflowCount}
            </button>
          ) : (
            // Empty placeholder to maintain 4-column grid when no overflow
            visibleImages.length < MAX_VISIBLE + 1 && (
              <div className="rounded-md h-full w-full bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700" />
            )
          )}
        </div>

        {/* Right Scroll */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => setStartIndex((prev) => prev + 1)}
            aria-label="Scroll right"
            title="Scroll right"
            className="absolute z-10 top-1/2 right-[1%] -translate-y-1/2 px-2
              opacity-0 pointer-events-none hover:cursor-pointer
              transition-opacity
              group-hover:opacity-100
              group-hover:pointer-events-auto"
          >
            <ChevronRightCircle
              size={30}
              className="text-white drop-shadow-md"
              fill="var(--chevron)"
            />
          </button>
        )}
      </div>
    </div>
  );

  // return (
  //   <div
  //     className={` ${className} bg-white p-2 grid grid-rows-[25rem_8rem] md:grid-rows-[28rem_12rem] gap-4 rounded-md dark:border-gray-700/50 dark:bg-[#1d2739] h-full`}
  //   >
  //     {/* Main Image */}
  //     <button
  //       type="button"
  //       aria-label="open large image view"
  //       className="rounded-md h-full w-full flex items-center justify-center overflow-hidden hover:cursor-pointer"
  //       onClick={() => {
  //         setIsOpen(true);
  //       }}
  //     >
  //       <img
  //         src={images[activeIndex]?.url}
  //         className="object-cover h-full w-full"
  //         alt={images[activeIndex]?.filename}
  //       />
  //     </button>

  //     {/* Photo count badge */}
  //     <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none select-none">
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="12"
  //         height="12"
  //         viewBox="0 0 24 24"
  //         fill="none"
  //         stroke="currentColor"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         aria-hidden="true"
  //       >
  //         <rect x="3" y="3" width="18" height="18" rx="2" />
  //         <circle cx="8.5" cy="8.5" r="1.5" />
  //         <polyline points="21 15 16 10 5 21" />
  //       </svg>
  //       <span>
  //         {activeIndex + 1} / {images.length}
  //       </span>
  //     </div>

  //     {isOpen && (
  //       <FullscreenImageModal
  //         images={images.map((img) => img.url)}
  //         setIsOpen={setIsOpen}
  //         activeIndex={activeIndex}
  //       />
  //     )}

  //     {/* Thumbnails */}
  //     <div className="relative flex items-center gap-4 h-32 md:h-48 group">
  //       {/* Left Scroll */}
  //       {canScrollLeft && (
  //         <button
  //           type="button"
  //           onClick={() => setStartIndex((prev) => prev - 1)}
  //           aria-label="Scroll left"
  //           title="Scroll left"
  //           className="absolute px-2 hover:cursor-pointer top-1/2 left-[2%] -translate-y-1/2"
  //         >
  //           <ChevronLeftCircle
  //             size={36}
  //             className=" text-white"
  //             fill="var(--chevron)"
  //           />
  //         </button>
  //       )}

  //       <div className="grid grid-cols-4 gap-2 h-full w-full">
  //         {/* Visible thumbnails */}
  //         {visibleImages.map((img, index) => {
  //           const actualIndex = startIndex + index;
  //           return (
  //             <button
  //               type="button"
  //               aria-label="button to set the image in large view"
  //               key={index}
  //               onClick={() => {
  //                 setActiveIndex(actualIndex);
  //               }}
  //               className={`cursor-pointer bg-gray-200 rounded-md h-full w-full overflow-hidden ${
  //                 actualIndex === activeIndex ? "ring-1 ring-primary" : ""
  //               } ${index === 2 ? "group/thumb" : ""}`}
  //             >
  //               <img
  //                 src={img.url}
  //                 className="h-full w-full object-cover rounded-md"
  //                 alt={img.filename}
  //               />
  //             </button>
  //           );
  //         })}
  //       </div>

  //       {/* Overflow indicator slot — shows when there are more images beyond MAX_VISIBLE */}
  //       {overflowCount > 0 ? (
  //         <button
  //           type="button"
  //           aria-label={`View ${overflowCount} more images`}
  //           onClick={() => setStartIndex((prev) => prev + 1)}
  //           className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md h-full w-full overflow-hidden flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
  //         >
  //           +{overflowCount}
  //         </button>
  //       ) : (
  //         // Empty placeholder to maintain 4-column grid when no overflow
  //         visibleImages.length < MAX_VISIBLE + 1 && (
  //           <div className="rounded-md h-full w-full bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700" />
  //         )
  //       )}

  //       {/* Right Scroll */}
  //       {canScrollRight && (
  //         <button
  //           type="button"
  //           onClick={() => setStartIndex((prev) => prev + 1)}
  //           aria-label="Scroll right"
  //           title="Scroll right"
  //           className="absolute top-1/2 right-[2%] -translate-y-1/2 px-2
  //                opacity-0 pointer-events-none hover:cursor-pointer
  //                transition-opacity
  //                group-hover:opacity-100
  //                group-hover:pointer-events-auto"
  //         >
  //           <ChevronRightCircle
  //             size={36}
  //             className=" text-white"
  //             fill="var(--chevron)"
  //           />
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // );
};
