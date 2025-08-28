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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AddTaskInput, addTaskSchema } from "../_schemas/add-task.schema";
import { toast } from "sonner";
import { addTaskAction } from "../_actions/add-task.action";

export type ContentNode = {
  type: string;
  content?: ContentNode[];
  attrs?: Record<string, unknown>;
};

export type EditorContent = {
  type: string;
  content: ContentNode[];
};

export function AddTaskDialog({ cardId }: { cardId: string }) {
  const [content, setContent] = useState<EditorContent | undefined>();
  const form = useForm<AddTaskInput>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      cardId: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  //   const router = useRouter();
  const onSubmit = async (values: AddTaskInput) => {
    console.log("submit fired!", values, content);
    startTransition(async () => {
      if (!content) return;
      const task = {
        ...values,
        dueDate: new Date(),
        cardId,
        content,
      };

      // console.log(123, task);
      const result = await addTaskAction(task);

      if (result.serverError || result.validationErrors) {
        toast.error(result.serverError || "An error occurred!");
      } else {
        toast.success("Task successfully created!");
        // router.push("/");
        form.reset();
      }
    });
  };

  return (
    <Dialog>
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
            className="space-y-4 sm:max-w-md"
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

            <SimpleEditor setContent={setContent} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending || !content}>
                {isPending ? "Adding..." : "Add task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
