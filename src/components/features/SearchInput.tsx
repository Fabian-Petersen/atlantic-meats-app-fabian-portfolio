"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import useGlobalContext from "@/context/useGlobalContext";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  enableMobile?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search requests...",
  enableMobile = false,
}: SearchInputProps) {
  const { openSearchInput, setOpenSearchInput } = useGlobalContext();
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openSearchInput && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [openSearchInput]);

  useEffect(() => {
    if (!openSearchInput) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSearchInput(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openSearchInput, setOpenSearchInput]);

  const handleMobileClose = () => {
    setOpenSearchInput(false);
  };

  return (
    <>
      {/* ── Desktop search (md+) ── */}
      <div className="hidden md:block relative h-full w-full lg:w-1/4">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            value
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full h-full pl-10.5 pr-10 text-sm rounded-md
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            border transition-all outline-none
            ${
              value
                ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/10"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            }
          `}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* ── Mobile search overlay ── */}
      {enableMobile && (
        <>
          {/* Full-screen backdrop — sits behind panel, closes on tap */}
          <div
            aria-hidden="true"
            onClick={handleMobileClose}
            className={`
              md:hidden fixed inset-0 z-40 bg-black/40 dark:bg-black/60
              transition-opacity duration-300
              ${openSearchInput ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          />

          {/* Slide-down panel — h-24 to cover navbar + menu row */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className={`
              md:hidden fixed inset-x-0 top-0 z-50 h-24
              flex items-center px-4
              bg-white dark:bg-gray-900
              border-b border-gray-200 dark:border-gray-700 shadow-lg
              transition-transform duration-300 ease-in-out
              ${openSearchInput ? "translate-y-0" : "-translate-y-full"}
            `}
          >
            <div className="relative w-full">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
                  value
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />

              <input
                ref={mobileInputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`
                  w-full h-12 pl-12 pr-12 text-base rounded-lg
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  border transition-all outline-none
                  ${
                    value
                      ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/10"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  }
                `}
              />

              {value && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// import { Search, X } from "lucide-react";

// interface SearchInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// export function SearchInput({
//   value,
//   onChange,
//   placeholder = "Search requests...",
// }: SearchInputProps) {
//   return (
//     <div className="hidden md:block relative h-full w-full lg:w-1/4">
//       <Search
//         className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
//           value
//             ? "text-blue-600 dark:text-blue-400"
//             : "text-gray-400 dark:text-gray-500"
//         }`}
//       />
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className={`
//           w-full h-full pl-10.5 pr-10 text-sm rounded-md
//           bg-white dark:bg-gray-900
//           text-gray-900 dark:text-gray-100
//           placeholder:text-gray-400 dark:placeholder:text-gray-500
//           border transition-all outline-none
//           ${
//             value
//               ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/10"
//               : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
//           }
//         `}
//       />
//       {value && (
//         <button
//           type="button"
//           aria-label="search button"
//           onClick={() => onChange("")}
//           className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//         >
//           <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//         </button>
//       )}
//     </div>
//   );
// }
