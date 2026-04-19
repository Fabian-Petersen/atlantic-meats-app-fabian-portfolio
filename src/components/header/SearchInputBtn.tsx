import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Button from "@/components/features/Button";

type SearchInputBtnProps = {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInputBtn({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className = "",
}: SearchInputBtnProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(value);
    setOpen(false); // collapse after search
  };

  return (
    <div className="p-2 flex items-center justify-center text-gray-900 hover:cursor-pointer relative">
      {/* Icon button (always visible) */}
      <Button
        type="button"
        aria-label="search button"
        onClick={() => setOpen(true)}
        className={`${className} hover:cursor-pointer rounded-full bg-white/30 p-1.5`}
      >
        <Search size={18} />
      </Button>

      {/* Expanding input */}
      <div
        className={`
          absolute right-0 transition-all duration-300 overflow-hidden
          ${open ? "w-64 opacity-100 ml-2" : "w-0 opacity-0"}
        `}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={placeholder}
            className="
              w-full h-9 pl-9 pr-8 text-sm rounded-md
              bg-white dark:bg-gray-900
              border border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-blue-500/20 outline-none
            "
          />

          {/* Left icon inside input */}
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              aria-label="clear search"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
