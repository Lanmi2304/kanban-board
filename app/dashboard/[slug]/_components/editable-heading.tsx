"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EditableHeading({ title }: { title: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={currentTitle}
          onBlur={() => setIsEditing(false)}
          onChange={(e) => setCurrentTitle(e.target.value)}
          autoFocus
          className="text-md w-fit font-bold"
        />
        <Button
          onClick={() => setIsEditing(false)}
          className="cursor-pointer text-sm"
          size={"sm"}
        >
          Save
        </Button>
      </div>
    );
  }
  return (
    <h1
      className="text-md cursor-pointer font-bold"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h1>
  );
}
