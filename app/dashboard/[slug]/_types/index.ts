type TaskContent = {
  type: string;
  content: {
    type: string;
    content?: unknown[];
    attrs?: Record<string, unknown>;
  }[];
};

export type AddTaskPayload = {
  title: string;
  userId?: string;
  cardId: string;
  projectId: string;
  content: TaskContent;
};
