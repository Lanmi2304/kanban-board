"use client";
import React, { useState } from "react";
import {
  DndContext,
  // UniqueIdentifier,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { Droppable } from "../../_components/droppable";
import { Draggable } from "../../_components/draggable";
import { cn } from "@/lib/utils/cn";
import { Calendar, Ellipsis, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectCards, Tasks } from "@/server/db/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-areat";
import { Card } from "@/components/ui/card";
// import { Tasks } from "@/server/db/schema";

// type TaskType = {
//   id: string;
//   title: string;
//   priority?: "low" | "medium" | "high";
//   content: string;
//   cardId: UniqueIdentifier;
//   createdAt: string;
//   dueDate: string;
// };

// type CardType = {
//   id: string;
//   title: string;
//   content: string;
// };

// const DEFAULT_CARDS: CardType[] = [
//   { id: "ready", title: "Ready", content: "This is ready to be picked up" },
//   { id: "in-progress", title: "In Progress", content: "This is in progress" },
//   { id: "in-review", title: "In Review", content: "This is in review" },
//   { id: "done", title: "Done", content: "This is done" },
// ];

// const TASKS: TaskType[] = [
//   {
//     id: "task-1",
//     title: "Do the homework",
//     content: "This is task 1",
//     cardId: "ready",
//     createdAt: new Date().toLocaleDateString(),
//     dueDate: new Date().toLocaleDateString(),
//   },
//   {
//     id: "task-2",
//     title: "Wash the car",
//     priority: "high",
//     content: "This is task 2",
//     cardId: "in-progress",
//     createdAt: new Date().toLocaleDateString(),
//     dueDate: new Date().toLocaleDateString(),
//   },
//   {
//     id: "task-3",
//     title: "Buy groceries",
//     content: "This is task 3",
//     cardId: "in-review",
//     createdAt: new Date().toLocaleDateString(),
//     dueDate: new Date().toLocaleDateString(),
//   },
//   {
//     id: "task-4",
//     title: "Clean the house",
//     content: "This is task 4",
//     cardId: "done",
//     createdAt: new Date().toLocaleDateString(),
//     dueDate: new Date().toLocaleDateString(),
//   },
//   {
//     id: "task-5",
//     title: "Clean the room",
//     content: "This is task 5",
//     cardId: "done",
//     createdAt: new Date().toLocaleDateString(),
//     dueDate: new Date().toLocaleDateString(),
//   },
// ];

type KanbanBoardProps = {
  tasks?: Tasks[];
  cards?: SelectCards[] | null;
};

export function KanbanBoard({ tasks, cards }: KanbanBoardProps) {
  // const [state, setState] = useState<{ tasks: TaskType[]; cards: CardType[] }>(
  //   () => ({
  //     tasks: TASKS,
  //     cards: DEFAULT_CARDS,
  //   }),
  // );

  const [activeTask, setActiveTask] = useState<Tasks | null>(null);

  // const tasksByCard = React.useMemo(() => {
  //   return state.tasks.reduce<Record<string, Tasks[]>>((acc, task) => {
  //     const cardId = task.cardId as string;
  //     if (!acc[cardId]) {
  //       acc[cardId] = [];
  //     }
  //     acc[cardId].push(task);
  //     return acc;
  //   }, {});
  // }, [state]);

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = tasks?.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const updatedState = tasks?.map((task) =>
        task.id === taskId ? { ...task, cardId: over.id } : task,
      );
      // Update tasks
      // setState({ ...state, tasks: updatedState });
    }
    setActiveTask(null);
  }

  // function handleAddNewCard() {
  //   const newCard: CardType = {
  //     id: `card-${state.cards.length + 1}`,
  //     title: `New Card ${state.cards.length + 1}`,
  //     content: "This is a new card",
  //   };
  //   setState({ ...state, cards: [...state.cards, newCard] });
  // }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project title</h1>
        <Button className="w-fit cursor-pointer" variant="outline">
          <Settings />
        </Button>
      </div>

      <Button onClick={() => console.log("Add card")} className="w-fit">
        + Add Card
      </Button>

      {/* <div
        className="flex flex-col gap-4 overflow-x-scroll md:flex-row"
        // style={{ scrollPadding: "1rem" }}
      > */}
      <ScrollArea>
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-4 md:space-y-0">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {cards?.map((card) => (
              <Card key={card.id} className="m-0 overflow-hidden p-0">
                <Droppable
                  id={card.id}
                  className="flex h-[560px] w-full min-w-80 shrink-0 flex-col overflow-y-visible rounded-xl p-4 first:ml-0 last:mr-0 md:w-80"
                >
                  <div className="h-1/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("size-4 rounded-full ring-2", {
                            "ring-blue-500": card.id.includes("ready"),
                            "ring-amber-500": card.id.includes("in-progress"),
                            "ring-purple-500": card.id.includes("in-review"),
                            "ring-green-500": card.id.includes("done"),
                          })}
                        ></div>
                        <h1 className="font-semibold">{card.title}</h1>
                      </div>
                      <Ellipsis className="text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                    <Button className="mt-2 w-full" variant="outline">
                      + Add Task
                    </Button>
                  </div>

                  <ScrollArea className="mt-2 flex h-4/5 w-full flex-col gap-2">
                    {tasks
                      ?.filter((task) => task.cardId === card.id)
                      .map((task) => (
                        <Draggable
                          key={task.id}
                          id={task.id}
                          className={cn(
                            "bg-muted/60 relative z-50 w-full cursor-pointer rounded-lg border p-2 focus:cursor-grab",
                            {
                              "border-blue-500": card.id === "ready",
                              "border-amber-500": card.id === "in-progress",
                              "border-purple-500": card.id === "in-review",
                              "border-green-500": card.id === "done",
                            },
                          )}
                        >
                          <p className="text-foreground/70 line-clamp-3 text-sm font-semibold">
                            {task.description}
                          </p>
                          <div className="text-foreground text-md mt-4 flex items-center justify-between font-semibold">
                            <div>
                              <span className="truncate">{task.title} </span>
                              {task.priority === "high" && (
                                <span className="animate-jumping inline-block font-bold text-red-600">
                                  !
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <Calendar className="size-4" />{" "}
                              {task.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        </Draggable>
                      ))}
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </Droppable>
              </Card>
            ))}

            <DragOverlay>
              {activeTask ? (
                <div className="bg-muted/90 rounded-lg border p-3 shadow-lg">
                  <p className="text-foreground/80 text-sm">
                    {activeTask.description}
                  </p>
                  <div className="mt-2 font-semibold">{activeTask.title}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
    // </div>
  );
}
