import { CreateProjectDialog } from "./_components/create-project-dialog";
import { getSession } from "@/lib/utils/get-session";
import { getProjects } from "./_repositories/get-projects-repository";
import { Projects } from "./_components/projects";

export default async function Dashboard() {
  const data = await getSession();
  const userId = data?.user.id;

  if (!userId) {
    return (
      <div>
        <p>You are not logged in.</p>
      </div>
    );
  }

  const projects = await getProjects(userId);
  return (
    <div className="mt-20 flex h-screen w-full items-start justify-center px-2 md:px-4">
      {projects.length > 0 ? (
        <div className="grid w-full gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <CreateProjectDialog />
          </div>
          <Projects projects={projects} />
        </div>
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
