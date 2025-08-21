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
import { ChangeEvent, KeyboardEvent, useRef } from "react";

export function CreateProjectDialog() {
  const form = useForm<CreateProjectSchemaInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref } = form.register("description");

  // 2. Define a submit handler.
  function onSubmit(values: CreateProjectSchemaInput) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              + Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new project by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
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
                      The title of your project. It should be unique and
                      descriptive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        onKeyDown={(event) => preventBreakRow(event)}
                        onInput={adjustTextareaHeight}
                        {...field}
                        ref={(element) => {
                          ref(element);
                          textAreaRef.current = element;
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
