"use client";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBoardAction } from "../_actions/delete-board.action";
import { toast } from "sonner";

export function BoardSettingsDropdown({ boardId }: { boardId: string }) {
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const deleteHandler = async () => {
    try {
      await toast.promise(deleteBoardAction({ boardId }), {
        loading: "Deleting board...",
        success: "Board deleted successfully. Redirecting to dashboard...",
        error: "Failed to delete board.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Board Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => setOpenAlert(true)}
            className="!hover:bg-destructive/90 bg-destructive !hover:text-white cursor-pointer text-white"
          >
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              board and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              //   onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                deleteHandler();
                // e.stopPropagation();
              }}
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
