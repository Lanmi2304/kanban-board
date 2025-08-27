"use server";

import { authActionClient } from "@/lib/safe-action";
import { addTaskSchema } from "../_schemas/add-task.schema";
import { addTask } from "../_repositories/add-task";

export const addTaskAction = authActionClient
  .metadata({ actionName: "addBlogAction" })
  .inputSchema(addTaskSchema)
  .action(
    async ({ parsedInput: { title, priority, content }, ctx: { userId } }) => {
      // console.log("USER: ", user);

      const cleanContent = JSON.parse(JSON.stringify(content));

      await addTask({
        title,
        priority,
        userId,
        content: cleanContent,
      });
    },
  );
