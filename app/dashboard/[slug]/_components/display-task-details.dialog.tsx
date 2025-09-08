"use client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tasks } from "@/server/db/schema";
import { EditorContent } from "./add-task.dialog";
import { useState, useMemo, useEffect } from "react";
import { JSONContent } from "@tiptap/core";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

type DisplayTaskDetailsProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Tasks | null;
};

export function DisplayTaskDetails({
  isOpen,
  setIsOpen,
  task,
}: DisplayTaskDetailsProps) {
  const [content, setContent] = useState<EditorContent | undefined>();

  const lowlight = createLowlight(all);
  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("js", js);
  lowlight.register("ts", ts);

  const memoContent = useMemo(() => {
    if (task?.content) {
      return task.content as JSONContent;
    }
  }, [task]);

  useEffect(() => {
    if (memoContent) {
      setContent(memoContent as EditorContent);
    }
  }, [memoContent]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex w-full !max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>{task?.title ?? "Task"}</DialogTitle>
          <DialogDescription>
            Detailed view of the task. You can edit the content below.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4 h-fit w-full space-y-4">
          <SimpleEditor content={content} setContent={setContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
