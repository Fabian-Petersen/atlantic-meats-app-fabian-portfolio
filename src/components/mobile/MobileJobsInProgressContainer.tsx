//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MobileJobsInProgressCard } from "./MobileJobsInProgressCard";

type Props = {
  data: Row<JobApprovedAPIResponse>[];
  className?: string;
};

/**
 * MobileJobsInProgressContainer
 *
 * This component serves as a container for rendering a list of
 * `MobileJobsInProgressCard` components in the mobile view.
 *
 * Responsibility:
 * - Iterates over table row data and renders a card for each job.
 * - Manages the expanded/collapsed state of individual cards.
 *
 * State Management:
 * - Maintains a single `openRowId` state to track which card is currently expanded.
 * - Ensures only one card can be open at a time:
 *   - Clicking an already open card will collapse it.
 *   - Clicking a different card will switch the open state.
 *
 * Props:
 * - `data`:
 *   - Array of `Row<JobApprovedAPIResponse>` objects from `@tanstack/react-table`.
 *   - Each row represents a job to be displayed.
 *
 * - `className` (optional):
 *   - Allows parent components to pass additional styling.
 *
 * Rendering:
 * - Maps over the provided `data` array and renders a
 *   `MobileJobsInProgressCard` for each row.
 * - Passes down:
 *   - `row`: the row data
 *   - `isOpen`: boolean indicating if the card is expanded
 *   - `onToggle`: function to control expand/collapse behavior
 *
 * Layout:
 * - Uses a vertical flex layout with spacing between cards.
 * - Designed specifically for mobile responsiveness.
 *
 * Dependencies:
 * - `MobileJobsInProgressCard` for individual job rendering
 * - `@tanstack/react-table` for row structure
 *
 * Notes:
 * - This component is purely presentational with minimal state logic.
 * - It delegates all job-specific rendering and interaction details
 *   to the `MobileJobsInProgressCard` component.
 */

export function MobileJobsInProgressContainer({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileJobsInProgressCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
