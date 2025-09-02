import { queryOptions } from "@tanstack/react-query";
import { toggleTaskStateAction } from "../_actions/toggle-task-state.action";

export const toggleTaskStateService = (taskId: string, newCardId: string) =>
  queryOptions({
    queryKey: ["toggleTaskStateService"],
    queryFn: () => toggleTaskStateAction({ taskId, newCardId }),
  });
