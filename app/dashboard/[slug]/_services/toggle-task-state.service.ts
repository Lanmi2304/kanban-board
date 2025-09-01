import { queryOptions } from "@tanstack/react-query";
import { toggleTaskStateAction } from "../_actions/toggle-task-state.action";

export const toggleTaskStateService = (taskId: string, cardStateId: string) =>
  queryOptions({
    queryKey: ["toggleTaskStateService"],
    queryFn: () =>
      toggleTaskStateAction({ cardId: taskId, projectId: cardStateId }),
  });
