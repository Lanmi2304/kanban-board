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
import { PureEditorContent } from "@tiptap/react";
import { toast } from "sonner";
import { addTaskAction } from "../_actions/add-task.action";

export function AddTaskDialog() {
  const [content, setContent] = useState<PureEditorContent | undefined>();
  const form = useForm<AddTaskInput>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      priority: "medium",
    },
  });

  const [isPending, startTransition] = useTransition();
  //   const router = useRouter();

  const onSubmit = async (values: AddTaskInput) => {
    startTransition(async () => {
      if (!content) return;
      const task = {
        ...values,
        content,
        priority: "medium",
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild className="mt-2 w-full cursor-pointer">
            <Button variant="outline">+ Add Task</Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Add a new task to your board.
                <br />
                Please enter the task details below.
              </DialogDescription>
            </DialogHeader>
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
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
