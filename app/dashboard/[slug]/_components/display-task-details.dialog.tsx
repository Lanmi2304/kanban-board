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
          <SimpleEditor
            isEditing={false}
            content={content}
            setContent={setContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
