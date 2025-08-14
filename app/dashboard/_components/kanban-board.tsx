"use client";
import React, { useState } from "react";
import { DndContext, UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";
import { cn } from "@/lib/utils/cn";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const DEFAULT_CARDS: CardType[] = [
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
  const [state, setState] = useState<{ tasks: TaskType[]; cards: CardType[] }>(
    () => {
      return {
        tasks: TASKS,
        cards: DEFAULT_CARDS,
      };
    },
  );

  const tasksByCard = React.useMemo(() => {
    return state.tasks.reduce<Record<string, TaskType[]>>((acc, task) => {
      const cardId = task.cardId as string;
      if (!acc[cardId]) {
        acc[cardId] = [];
      }
      acc[cardId].push(task);
      return acc;
    }, {});
  }, [state]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const updatedState = state.tasks.map((task) =>
        task.id === taskId ? { ...task, cardId: over.id } : task,
      );
      setState({ ...state, tasks: updatedState });
    }
  }

  // Add a form to create new cards
  function handleAddNewCard() {
    const newCard: CardType = {
      id: `card-${state.cards.length + 1}`,
      title: `New Card ${state.cards.length + 1}`,
      content: "This is a new card",
    };
    setState({ ...state, cards: [...state.cards, newCard] });
    console.log("ok");
  }

  return (
    <div className="flex w-fit flex-row items-start">
      <div className="flex w-full flex-row justify-center gap-4 overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          {state.cards.map((card) => (
            <Droppable
              key={card.id}
              id={card.id}
              className="min-w-80 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn("size-4 rounded-full ring-2", {
                      "ring-blue-500": card.id === "ready",
                      "ring-amber-500": card.id === "in-progress",
                      "ring-purple-500": card.id === "in-review",
                      "ring-green-500": card.id === "done",
                    })}
                  ></div>
                  <h1 className="font-semibold">{card.title}</h1>
                </div>
                <Ellipsis className="text-primary" />
              </div>

              <p className="text-muted-foreground text-sm">{card.content}</p>
              <Button className="mt-2 w-full cursor-pointer" variant="outline">
                + Add Task
              </Button>
              <div className="mt-2 flex flex-col gap-2">
                {(tasksByCard[card.id] || []).map((task) => (
                  <Draggable
                    key={task.id}
                    id={task.id}
                    className="w-full cursor-pointer focus:cursor-grab"
                  >
                    {task.title}
                  </Draggable>
                ))}
              </div>
            </Droppable>
          ))}
        </DndContext>
        <Button onClick={handleAddNewCard}> + Add Card</Button>
      </div>
    </div>
  );
}
