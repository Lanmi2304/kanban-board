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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function SettingsDropdown({ taskId }: { taskId: string }) {
  const [openAlert, setOpenAlert] = useState(false);
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

  const alertToggleHandler = (open: boolean) => {
    setOpenAlert(open);
  };

  const deleteHandler = () => {
    mutation.mutate(taskId);
  };

  return (
    <>
      <DropdownMenu modal={false} data-no-dnd="true">
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <Button variant="ghost" className="p-0">
            <Ellipsis className="text-primary size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative z-50 flex flex-col gap-1">
          <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAlert(true)}
            className="hover:bg-destructive/90! bg-destructive cursor-pointer text-white hover:text-white!"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              task and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteHandler}
              className="cursor-pointer"
              asChild
            >
              <Button variant="destructive">Continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
