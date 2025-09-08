/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { generateHTML } from "@tiptap/html";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { HardBreak } from "@tiptap/extension-hard-break";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Code from "@tiptap/extension-code";
import Strike from "@tiptap/extension-strike";
import BlockQuote from "@tiptap/extension-blockquote";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { JSONContent } from "@tiptap/core";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import { OrderedList } from "@tiptap/extension-list";

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

  // Central list of extensions (avoid recreating arrays on each render)
  const extensions = useMemo(
    () => [
      Document,
      Paragraph,
      Text,
      Bold,
      Heading,
      Italic,
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
        // defaultLanguage: "javascript",
      }),
      Code,
      BlockQuote,
      Strike,
      TipTapImage,
      Superscript,
      Subscript,
      Underline,
      Typography,
      ListItem,
      TextAlign,
      BulletList,
      HorizontalRule,
      HardBreak,
      TaskItem,
      TaskList,
      Link,
      OrderedList,
    ],
    [lowlight],
  );

  // Normalize any stored JSON into a proper doc node
  const raw = (content ?? (task?.content as unknown)) as unknown;

  function ensureDoc(json: unknown): JSONContent | null {
    if (!json || typeof json !== "object") return null;
    const obj = json as Record<string, unknown>;
    if (obj.type === "doc") return obj as JSONContent;
    if (Array.isArray(obj.content)) {
      return { type: "doc", content: obj.content as JSONContent[] };
    }
    return null;
  }

  const normalized = useMemo(() => ensureDoc(raw), [raw]);

  // const html = useMemo(() => {
  //   if (!normalized) return "";
  //   try {
  //     return generateHTML(normalized, extensions);
  //   } catch (e) {
  //     console.error("Failed to generate HTML from editor JSON:", e);
  //     return "";
  //   }
  // }, [normalized, extensions]);

  useEffect(() => {
    if (!content && normalized) {
      setContent(normalized as unknown as EditorContent);
    }
  }, [normalized, content]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex w-full max-w-3xl! flex-col">
        <DialogHeader>
          <DialogTitle>{task?.title ?? "Task"}</DialogTitle>
          <DialogDescription>
            Detailed view of the task. You can edit the content below.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4 h-fit w-full space-y-4">
          <SimpleEditor
            content={normalized as EditorContent | undefined}
            setContent={setContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
