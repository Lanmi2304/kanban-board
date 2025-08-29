import { queryOptions } from "@tanstack/react-query";
import { addTaskAction } from "../_actions/add-task.action";
import { AddTaskPayload } from "../_types";

export const addTaskService = (task: AddTaskPayload) =>
  queryOptions({
    queryKey: ["addTaskService"],
    queryFn: () => addTaskAction(task),
  });
