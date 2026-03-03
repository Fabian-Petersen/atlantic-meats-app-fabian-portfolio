import type { ActionAPIResponse, ActionMetrics } from "@/schemas";
import { getActionsCompletedChange } from "./getActionsCompletedChange";

export const getActionCardValues = (
  actions: ActionAPIResponse[],
): ActionMetrics => {
  const totalCompleted = actions.length;
  const { totalCompletedChange } = getActionsCompletedChange(actions);

  return {
    totalCompleted: {
      value: totalCompleted,
      valueChange: totalCompletedChange,
    },
  };
};
