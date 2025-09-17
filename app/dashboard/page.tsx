import { CreateProjectDialog } from "./_components/create-project-dialog";
import { getSession } from "@/lib/utils/get-session";
import { getProjects } from "./_repositories/get-projects-repository";
import { Projects } from "./_components/projects";
import { PopularTemplates } from "./_components/popular-templates";
import { LayoutTemplate } from "lucide-react";

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
    <div className="mx-auto mt-20 flex h-screen w-full max-w-7xl flex-col items-start justify-start px-2 md:px-4">
      <div className="mb-10 flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <LayoutTemplate className="text-muted-foreground" />
          <h1 className="scroll-m-20 text-left text-xl font-extrabold tracking-tight text-balance">
            Most popular templates
          </h1>
        </div>

        <div>
          <PopularTemplates />
          <hr className="my-4 w-full border-t" />
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid w-full gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance uppercase">
              Your workspaces
            </h1>
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
