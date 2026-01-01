import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div
      className={`fixed xl:hidden left-1/2 -translate-x-1/2 md:left-[95%] top-[90%] z-1000 transition-all duration-500 ${
        isScrolled
          ? "animate-scrollToTop pointer-events-auto"
          : "translate-y-[100vh] opacity-0 pointer-events-none"
      }`}
    >
      <button
        className={`text-white flex items-center justify-center rounded-full bg-primary hover:scale-105 hover:cursor-pointer transform transition-transform duration-800`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp className="size-10 text-font" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
