"use client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AddTaskInput, addTaskSchema } from "../_schemas/add-task.schema";
import { toast } from "sonner";
import { addTaskAction } from "../_actions/add-task.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ContentNode = {
  type: string;
  content?: ContentNode[];
  attrs?: Record<string, unknown>;
};

export type EditorContent = {
  type: string;
  content: ContentNode[];
};

export function AddTaskDialog({
  cardId,
  projectId,
}: {
  cardId: string;
  projectId: string;
}) {
  const [content, setContent] = useState<EditorContent | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddTaskInput>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      cardId: cardId,
      projectId: projectId,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTodo: AddTaskInput) => {
      await addTaskAction(newTodo);
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred");
      setIsDialogOpen(false);
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      toast.success("Task added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  async function onSubmit(values: AddTaskInput) {
    startTransition(async () => {
      if (!content) {
        toast.error("Task content is required!");
        return;
      }

      const task = {
        ...values,
        dueDate: new Date(),
        cardId,
        projectId,
        content,
      };

      mutation.mutate(task);
    });
  }

  useEffect(() => {
    if (content) {
      form.setValue("content", content, { shouldValidate: true });
    }
  }, [content, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 w-full cursor-pointer">
          + Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board.
            <br />
            Please enter the task details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 sm:max-w-md"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Without this fix my onSubmit handler wont even fire */}
            <input type="hidden" {...form.register("cardId")} />
            <input type="hidden" {...form.register("projectId")} />

            <SimpleEditor setContent={setContent} />

            <DialogFooter>
              <DialogClose asChild className="dialog-close">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
