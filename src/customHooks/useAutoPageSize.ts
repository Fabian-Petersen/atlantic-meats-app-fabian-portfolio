// $ This hook calculates the available height for an element to fit on a full screen page.
// $ In this project it was used to fit the table on the available screen real estate by setting the pageSize such that the user dont have to scroll or the dev manually set the value for different breakpoints.

import { useEffect, useRef } from "react";
import type { Table } from "@tanstack/react-table";
import { calculatePageSizeFromHeight } from "@/utils/calculatePageSizeFromHeight";

type UseAutoPageSizeOptions = {
  rowHeight: number;
  headerHeight?: number;
  footerHeight?: number;
  minRows?: number;
};

export function useAutoPageSize<T>(
  table: Table<T>,
  options: UseAutoPageSizeOptions,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPageSizeRef = useRef<number | null>(null);
  useEffect(() => {
    // console.log("containerRef:", containerRef);
    if (!containerRef.current) return;

    const updatePageSize = () => {
      if (!containerRef.current) return;

      const nextPageSize = Math.min(
        calculatePageSizeFromHeight(containerRef.current, options),
        10,
      );

      // console.log("nextPageSize:", nextPageSize);

      // ✅ Prevent infinite loop
      if (lastPageSizeRef.current === nextPageSize) return;

      lastPageSizeRef.current = nextPageSize;
      table.setPageSize(nextPageSize);
    };

    updatePageSize();

    const observer = new ResizeObserver(updatePageSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
    // ❗ DO NOT depend on table.getState()
  }, [table, options]);

  return containerRef;
}
