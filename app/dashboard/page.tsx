import { KanbanBoard } from "./_components/kanban-board";
import { CreateProjectDialog } from "./_components/create-project-dialog";

const projects = [];
export default function Dashboard() {
  return (
    <div className="mt-20 flex h-screen w-full items-start justify-center">
      {projects.length > 0 ? (
        <KanbanBoard />
      ) : (
        <div className="mt-20 flex size-full flex-col items-center justify-start gap-2">
          <p>No projects found.</p>
          <p className="text-muted-foreground">
            Please create a project to get started.
          </p>
          <CreateProjectDialog />
        </div>
      )}
    </div>
  );
}
