"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { editProjectTitleAction } from "../_actions/edit-project-title.action";
import { toast } from "sonner";

export function EditableHeading({
  title,
  projectId,
}: {
  title: string;
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isPending, startTransition] = useTransition();
  const [displayTitle, setDisplayTitle] = useState(title);

  const mutation = useMutation({
    mutationFn: async (newTitle: string) => {
      await editProjectTitleAction({ newTitle, projectId });
    },
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Project title updated successfully.");
      setDisplayTitle(currentTitle);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project title.");
      setDisplayTitle(title);
    },
  });

  const handleTitleChange = () => {
    if (currentTitle !== title) {
      startTransition(() => {
        mutation.mutate(currentTitle);
      });
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={currentTitle}
          onBlur={() => handleTitleChange()}
          onChange={(e) => setCurrentTitle(e.target.value)}
          autoFocus
          className="text-md w-fit font-bold"
        />
        <Button
          onClick={() => setIsEditing(false)}
          className="cursor-pointer text-sm"
          size={"sm"}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }
  return (
    <h1
      className="text-md cursor-pointer font-bold"
      onClick={() => setIsEditing(true)}
    >
      {displayTitle}
    </h1>
  );
}
