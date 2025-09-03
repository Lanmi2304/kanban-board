"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { deleteTaskAction } from "../_actions/delete-task.action";

export function SettingsDropdown({ taskId }: { taskId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTaskAction({ taskId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    },
  });
  const deleteHandler = () => {
    mutation.mutate(taskId);
  };

  return (
    <DropdownMenu modal={false} data-no-dnd="true">
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" className="p-0">
          <Ellipsis className="text-primary size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="relative z-50 flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={deleteHandler}
          className="hover:bg-destructive/90! bg-destructive cursor-pointer text-white hover:text-white!"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
