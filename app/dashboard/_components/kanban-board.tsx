"use client";
import React, { useState } from "react";
import {
  DndContext,
  UniqueIdentifier,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";
import { cn } from "@/lib/utils/cn";
import { Dot, Ellipsis, Settings } from "lucide-react";

type TaskType = {
  id: string;
  title: string;
  content: string;
  cardId: UniqueIdentifier;
};

type CardType = {
  id: string;
  title: string;
  content: string;
};

const CARDS: CardType[] = [
  { id: "ready", title: "Ready", content: "This is ready to be picked up" },
  { id: "in-progress", title: "In Progress", content: "This is in progress" },
  { id: "in-review", title: "In Review", content: "This is in review" },
  { id: "done", title: "Done", content: "This is done" },
];

// Get from the db
const TASKS: TaskType[] = [
  { id: "task-1", title: "Task 1", content: "This is task 1", cardId: "ready" },
  {
    id: "task-2",
    title: "Task 2",
    content: "This is task 2",
    cardId: "in-progress",
  },
  {
    id: "task-3",
    title: "Task 3",
    content: "This is task 3",
    cardId: "in-review",
  },
  { id: "task-4", title: "Task 4", content: "This is task 4", cardId: "done" },
  { id: "task-5", title: "Task 5", content: "This is task 5", cardId: "ready" },
];

export function KanbanBoard() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [state, setState] = useState<TaskType[]>(() => TASKS);

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const taskId = activeId as string;
    const updatedState = state.map((task) =>
      task.id === taskId ? { ...task, cardId: over.id } : task,
    );
    setState(updatedState);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  return (
    <div className="flex w-full flex-row justify-center gap-4">
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {CARDS.map((card) => (
          <Droppable
            key={card.id}
            id={card.id}
            className="min-w-80 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-4 rounded-full ring-2",
                    card.id === "ready" ? "ring-blue-500" : null,
                    card.id === "in-progress" ? "ring-amber-500" : null,
                    card.id === "in-review" ? "ring-purple-500" : null,
                    card.id === "done" ? "ring-green-500" : null,
                  )}
                ></div>
                <h1 className="font-semibold">{card.title}</h1>
              </div>
              <Ellipsis className="text-primary" />
            </div>

            <p className="text-muted-foreground text-sm">{card.content}</p>
            <div className="mt-2 flex flex-col gap-2">
              {state
                .filter((task) => task.cardId === card.id)
                .map((task) => (
                  <Draggable
                    key={task.id}
                    id={task.id}
                    className="cursor-pointer focus:cursor-grab"
                  >
                    {task.title}
                  </Draggable>
                ))}
            </div>
          </Droppable>
        ))}
      </DndContext>
    </div>
  );
}
