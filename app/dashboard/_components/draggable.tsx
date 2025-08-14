"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";

export function Draggable({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn("size-fit bg-red-400", className)}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
