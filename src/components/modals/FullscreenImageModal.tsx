import { useState, useRef, type Dispatch, type SetStateAction } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
type Props = {
  images: string[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  activeIndex: number;
};

function FullscreenImageModal({ images, setIsOpen, activeIndex }: Props) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number>(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const prevImage = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  // Start swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Move swipe
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchMoveX(currentX - touchStartX);
  };

  // End swipe
  const handleTouchEnd = () => {
    if (touchStartX === null) return;

    if (touchMoveX > 50 && currentIndex > 0) {
      prevImage(); // swipe right
    } else if (touchMoveX < -50 && currentIndex < images.length - 1) {
      nextImage(); // swipe left
    }
    setTouchStartX(null);
    setTouchMoveX(0);
  };

  return (
    <div
      className="fixed inset-0 z-1000 bg-black bg-opacity-30 h-screen w-screen flex items-center justify-center overflow-hidden"
      onClick={() => setIsOpen(false)}
    >
      {/* Close button */}
      <button
        className="absolute top-8 right-8 text-white text-2xl z-50 hover:cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <X size={24} />
      </button>

      {/* Image container */}
      <div
        ref={imgRef}
        className="p-4 relative w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{ transform: `translateX(${touchMoveX}px)` }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          //   src={images[activeIndex]}
          className="max-h-full max-w-full object-contain rounded-md"
        />
      </div>

      {/* Prev button */}
      <button
        className={`absolute left-4 z-50 ${
          currentIndex === 0
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        disabled={currentIndex === 0}
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
      >
        <ChevronLeft size={36} className=" text-white" />
      </button>

      {/* Next button */}
      <button
        className={`absolute right-4 z-50 ${
          currentIndex === images.length - 1
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        disabled={currentIndex === images.length - 1}
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
      >
        <ChevronRight size={36} className=" text-white" />
      </button>
    </div>
  );
}

export default FullscreenImageModal;
