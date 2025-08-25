import { CreateProjectDialog } from "./_components/create-project-dialog";
import { getSession } from "@/lib/utils/get-session";
import { getProjects } from "./_repositories/get-projects-repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
    <div className="mt-20 flex h-screen w-full items-start justify-center">
      {projects.length > 0 ? (
        // <KanbanBoard projects={projects} />
        <div className="grid w-full gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            {/* TODO: refactor to client component*/}
            <CreateProjectDialog />
          </div>
          <div className="grid w-full gap-4">
            {projects.map((project) => (
              <Link href={`/dashboard/${project.id}`} key={project.id}>
                <Card
                  key={project.id}
                  className="hover:bg-accent hover:cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
