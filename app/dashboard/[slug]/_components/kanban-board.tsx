"use client";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Droppable } from "../../_components/droppable";
import { Draggable } from "../../_components/draggable";
import {
  MouseSensor,
  TouchSensor,
} from "../../_components/smart-pointer-sensor";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsDropdown } from "./settings-dropdown";
import { DisplayTaskDetails } from "./display-task-details.dialog";

type KanbanBoardProps = {
  cards?: SelectCards[] | null;
  project: Projects;
};

export function KanbanBoard({ cards, project }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Tasks | null>(null);
  const [localTasks, setLocalTasks] = useState<Tasks[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", project.id],
    queryFn: async () => {
      const response = await fetchTasksByProjectId(project.id);
      return response || [];
    },
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setLocalTasks(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (variables: { taskId: string; newCardId: string }) =>
      toggleTaskStateAction(variables),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", project.id] });

      // Rollback
      const previousTasks = [...localTasks];

      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === newData.taskId
            ? { ...task, cardId: newData.newCardId }
            : task,
        ),
      );

      return { previousTasks };
    },
    onError: (err, newData, context) => {
      if (context?.previousTasks) {
        setLocalTasks(context.previousTasks);
      }
      toast.error(err.message || "Error moving task");
    },
    onSuccess: () => {
      toast.success("Task moved successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project.id] });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const taskId = event.active.id as string;
    const task = localTasks.find((t) => t.id === taskId) || null;
    if (task) setActiveTask(task);
  }

  // Sensors (custom sensor which i found on github issue for propagation prevention)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 350, tolerance: 5 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setIsDragging(false);
      return;
    }

    const taskId = active.id as string;
    const targetCardId = over.id as string;
    const task = localTasks.find((t) => t.id === taskId);

    if (task && task.cardId === targetCardId) {
      setIsDragging(false);
      setActiveTask(null);
      return;
    }

    setLocalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, cardId: targetCardId } : t)),
    );

    if (activeTask && activeTask.id === taskId) {
      setActiveTask({ ...activeTask, cardId: targetCardId });
    }

    mutation.mutate({ taskId, newCardId: targetCardId });

    // Set isDragging to false after a short delay to allow the animation to complete
    setTimeout(() => {
      setIsDragging(false);
      setActiveTask(null);
    }, 50);
  }

  // function handleAddNewCard() {
  //   const newCard: CardType = {
  //     id: `card-${state.cards.length + 1}`,
  //     title: `New Card ${state.cards.length + 1}`,
  //     content: "This is a new card",
  //   };
  //   setState({ ...state, cards: [...state.cards, newCard] });
  // }
  const handleTaskClick = (task: Tasks) => {
    setActiveTask(task);
    setIsDetailsOpen(true);
  };

  return (
    <>
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
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              data-no-dnd="true"
            >
              {cards?.map((card) => (
                <Card key={card.id} className="m-0 overflow-hidden p-0">
                  <Droppable
                    id={card.id}
                    className={cn(
                      "flex h-[560px] w-full min-w-80 shrink-0 flex-col overflow-x-hidden rounded-xl p-4 first:ml-0 last:mr-0 md:w-80",
                      {
                        "ring-2 ring-offset-2": isDragging,
                        "ring-blue-500":
                          isDragging && card.id.includes("ready"),
                        "ring-amber-500":
                          isDragging && card.id.includes("in-progress"),
                        "ring-purple-500":
                          isDragging && card.id.includes("in-review"),
                        "ring-green-500":
                          isDragging && card.id.includes("done"),
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
                      {isLoading &&
                        Array.from({ length: 5 }).map((el, id) => (
                          <Skeleton
                            key={id}
                            className="mt-2 h-18 w-full first:mt-0"
                          />
                        ))}

                      {localTasks
                        .filter((task: Tasks) => task.cardId === card.id)
                        .map((task: Tasks) => (
                          <div
                            key={task.id}
                            className="mt-2 first:mt-0"
                            onClick={() => {
                              handleTaskClick(task);
                            }}
                          >
                            <Draggable
                              id={task.id}
                              className={cn(
                                "bg-muted/60 relative z-10 w-full cursor-pointer rounded-lg border p-2 focus:cursor-grab",
                                {
                                  "border-blue-500": card.id.includes("ready"),
                                  "border-amber-500":
                                    card.id.includes("in-progress"),
                                  "border-purple-500":
                                    card.id.includes("in-review"),
                                  "border-green-500": card.id.includes("done"),
                                },
                                activeTask?.id === task.id && isDragging
                                  ? "opacity-0"
                                  : "opacity-100",
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-foreground/70 line-clamp-3 text-sm font-semibold">
                                  DEFAULT DESCRIPTION
                                </p>
                                <SettingsDropdown taskId={task.id} />
                              </div>

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
                          </div>
                        ))}
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </Droppable>
                </Card>
              ))}

              <DragOverlay
                dropAnimation={{
                  duration: 0, // Disabled immediate
                }}
                className="relative z-10"
              >
                {activeTask && isDragging ? (
                  <div
                    className={cn(
                      "bg-muted/90 scale-105 transform rounded-lg border p-3 shadow-lg",
                      {
                        "border-blue-500 ring-1 ring-blue-300":
                          activeTask.cardId.includes("ready"),
                        "border-amber-500 ring-1 ring-amber-300":
                          activeTask.cardId.includes("in-progress"),
                        "border-purple-500 ring-1 ring-purple-300":
                          activeTask.cardId.includes("in-review"),
                        "border-green-500 ring-1 ring-green-300":
                          activeTask.cardId.includes("done"),
                      },
                    )}
                    style={{
                      // Add transition for smooth color changes
                      transition:
                        "border-color 0.15s ease, box-shadow 0.15s ease",
                    }}
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

      <DisplayTaskDetails
        task={activeTask}
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
      />
    </>
  );
}
