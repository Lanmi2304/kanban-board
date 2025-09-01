"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { Droppable } from "../../_components/droppable";
import { Draggable } from "../../_components/draggable";
import { cn } from "@/lib/utils/cn";
import { Calendar, Ellipsis, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Projects, SelectCards, Tasks } from "@/server/db/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AddTaskDialog } from "./add-task.dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasksByProjectId } from "../_actions/fetch-tasks.action";
import { toggleTaskStateAction } from "../_actions/toggle-task-state.action";
import { toast } from "sonner";

type KanbanBoardProps = {
  cards?: SelectCards[] | null;
  project: Projects;
};

export function KanbanBoard({ cards, project }: KanbanBoardProps) {
  // const [state, setState] = useState<{ tasks: TaskType[]; cards: CardType[] }>(
  //   () => ({
  //     tasks: TASKS,
  //     cards: DEFAULT_CARDS,
  //   }),
  // );

  const [activeTask, setActiveTask] = useState<Tasks | null>(null);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const { data = [] } = useQuery({
    queryKey: ["tasks", project.id],
    queryFn: async () => {
      const response = await fetchTasksByProjectId(project.id);
      return response || [];
    },
  });

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

  const mutation = useMutation({
    mutationFn: (variables: { cardId: string; projectId: string }) =>
      toggleTaskStateAction(variables),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", project.id] });

      const previousTasks = queryClient.getQueryData(["tasks", project.id]);

      // Immediately update the activeTask for a better UX during the drag
      if (activeTask && activeTask.id === newData.cardId) {
        setActiveTask({ ...activeTask, cardId: newData.projectId });
      }

      queryClient.setQueryData(["tasks", project.id], (old: Tasks[] = []) =>
        old.map((task) =>
          task.id === newData.cardId
            ? { ...task, cardId: newData.projectId }
            : task,
        ),
      );

      return { previousTasks };
    },
    onError: (err, newData, context) => {
      toast.error("Error moving task");
      queryClient.setQueryData(["tasks", project.id], context?.previousTasks);
      // console.error("Error toggling task state:", err);
    },
    onSettled: () => {
      toast.success("Task moved successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", project.id] });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const taskId = event.active.id as string;
    const task = Array.isArray(data)
      ? data.find((t: Tasks) => t.id === taskId)
      : null;
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const taskId = active.id as string;

      if (activeTask) {
        setActiveTask({ ...activeTask, cardId: over.id as string });
      }
      mutation.mutate(
        { cardId: taskId, projectId: over.id as string },
        {
          onSuccess: () => {
            setActiveTask(null);
            setIsDragging(false);
          },
        },
      );
    } else {
      setActiveTask(null);
      setIsDragging(false);
    }
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
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Button className="w-fit cursor-pointer" variant="outline">
          <Settings />
        </Button>
      </div>

      <Button onClick={() => console.log("Add card")} className="w-fit">
        + Add Card
      </Button>

      <ScrollArea>
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-4 md:space-y-0">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {cards?.map((card) => (
              <Card key={card.id} className="m-0 overflow-hidden p-0">
                <Droppable
                  id={card.id}
                  className={cn(
                    "flex h-[560px] w-full min-w-80 shrink-0 flex-col overflow-y-visible rounded-xl p-4 first:ml-0 last:mr-0 md:w-80",
                    {
                      "ring-2 ring-offset-2": isDragging,
                      "ring-blue-500": isDragging && card.id.includes("ready"),
                      "ring-amber-500":
                        isDragging && card.id.includes("in-progress"),
                      "ring-purple-500":
                        isDragging && card.id.includes("in-review"),
                      "ring-green-500": isDragging && card.id.includes("done"),
                    },
                  )}
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
                    <AddTaskDialog
                      cardId={card.id}
                      projectId={card.projectId}
                    />
                  </div>

                  <ScrollArea className="flex h-4/5 w-full flex-col">
                    {Array.isArray(data) &&
                      data
                        .filter((task: Tasks) => task.cardId === card.id)
                        .map((task: Tasks) => (
                          <Draggable
                            key={task.id}
                            id={task.id}
                            className={cn(
                              "bg-muted/60 relative z-50 mt-2 w-full cursor-pointer rounded-lg border p-2 first:mt-0 focus:cursor-grab",
                              {
                                "border-blue-500": card.id.includes("ready"),
                                "border-amber-500":
                                  card.id.includes("in-progress"),
                                "border-purple-500":
                                  card.id.includes("in-review"),
                                "border-green-500": card.id.includes("done"),
                              },
                              activeTask?.id === task.id
                                ? "opacity-0"
                                : "opacity-100",
                            )}
                          >
                            <p className="text-foreground/70 line-clamp-3 text-sm font-semibold">
                              DEFAULT DESCRIPTION
                            </p>
                            <div className="text-foreground text-md mt-4 flex items-center justify-between font-semibold">
                              <div>
                                <span className="inline-block w-40 truncate">
                                  {task.title}{" "}
                                </span>
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
              {activeTask && isDragging ? (
                <div
                  className={cn(
                    "bg-muted/90 scale-105 rotate-1 transform rounded-lg border p-3 shadow-lg",
                    {
                      "border-blue-500": activeTask.cardId.includes("ready"),
                      "border-amber-500":
                        activeTask.cardId.includes("in-progress"),
                      "border-purple-500":
                        activeTask.cardId.includes("in-review"),
                      "border-green-500": activeTask.cardId.includes("done"),
                    },
                  )}
                >
                  <p className="text-foreground/80 text-sm">
                    DEFAULT DESCRIPTION ACTIVE TASK
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
