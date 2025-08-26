"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Projects } from "@/server/db/schema";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Projects({ projects }: { projects: Projects[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("project-query")?.toLowerCase() || "";

  console.log(projects);
  return (
    <div className="grid w-2/3 gap-4">
      {projects.filter((project) =>
        project.title.toLowerCase().includes(search),
      ).length === 0 && (
        <div className="flex size-full items-center justify-center">
          No projects found
        </div>
      )}
      {projects
        .filter((project) => project.title.toLowerCase().includes(search))
        .map((project) => (
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
                <p className="text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
}
