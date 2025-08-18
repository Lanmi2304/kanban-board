"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";

export function Droppable({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 md:h-[90dvh]",
        isOver ? "bg-muted" : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}
