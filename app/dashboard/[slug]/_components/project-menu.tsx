import { Projects } from "@/server/db/schema";
import { EditableHeading } from "./editable-title";
import { editProjectTitleAction } from "../_actions/edit-project-title.action";
import { BoardSettingsDropdown } from "./board-settings-dropdown";

export function ProjectMenu({ project }: { project: Projects }) {
  return (
    <div className="bg-background/70 fixed z-50 flex w-full items-center justify-between px-4 py-2 shadow-md backdrop-blur-sm">
      <EditableHeading
        title={project.title}
        projectId={project.id}
        editTitle={editProjectTitleAction}
      />
      {/* Future actions like edit, delete can go here */}
      <BoardSettingsDropdown boardId={project.id} />
    </div>
  );
}
