import { Button } from "@/components/ui/button";
import { Projects } from "@/server/db/schema";
import { Settings } from "lucide-react";
import { EditableHeading } from "./editable-title";
import { editProjectTitleAction } from "../_actions/edit-project-title.action";

export function ProjectMenu({ project }: { project: Projects }) {
  return (
    <div className="bg-background/70 flex w-full items-center justify-between px-4 py-2 shadow-md backdrop-blur-sm">
      <EditableHeading
        title={project.title}
        projectId={project.id}
        editTitle={editProjectTitleAction}
      />
      <Button variant="ghost" size="icon" className="cursor-pointer">
        <Settings />
      </Button>
      {/* Future actions like edit, delete can go here */}
    </div>
  );
}
