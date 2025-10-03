"use client";

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
import {
  createProjectSchema,
  CreateProjectSchemaInput,
} from "../_schemas/create-project.schema";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { createNewProjectAction } from "./_actions/create-project.action";
import { toast } from "sonner";

export function CreateProjectDialog() {
  const form = useForm<CreateProjectSchemaInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref } = form.register("description");

  async function onSubmit(values: CreateProjectSchemaInput) {
    startTransition(async () => {
      try {
        const { data } = await createNewProjectAction(values);

        if (data?.success) toast.success("Project created successfully!");
        form.reset();
        setOpen(false);
      } catch (error) {
        console.error("Error creating project:", error);
        toast.error("Failed to create project.");
      }
    });
  }

  const adjustTextareaHeight = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${event.target.scrollHeight}px`;
    }
  };

  const preventBreakRow = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          + Create Workspace
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new project by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief title for the project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Enter project description"
                        className="peer max-h-40 resize-none bg-transparent"
                        onKeyDown={preventBreakRow}
                        onInput={adjustTextareaHeight}
                        {...field}
                        ref={(element) => {
                          ref(element);
                          textAreaRef.current = element;
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed brief of the project.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
