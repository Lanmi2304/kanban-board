"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

type EditableHeadingProps = {
  title: string;
  projectId: string;
  editTitle: ({
    newTitle,
    projectId,
  }: {
    newTitle: string;
    projectId: string;
  }) => void;
  className?: string;
};

export function EditableHeading({
  title,
  projectId,
  editTitle,
  className,
}: EditableHeadingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isPending, startTransition] = useTransition();
  const [displayTitle, setDisplayTitle] = useState(title);

  const mutation = useMutation({
    mutationFn: async (newTitle: string) => {
      // Reusable action to edit project title (Dynamic passed as a prop)
      await editTitle({ newTitle, projectId });
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
    if (currentTitle !== title && currentTitle.trim() !== "") {
      startTransition(() => {
        mutation.mutate(currentTitle);
      });
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
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
    <h1 className="cursor-pointer font-bold" onClick={() => setIsEditing(true)}>
      {displayTitle}
    </h1>
  );
}
