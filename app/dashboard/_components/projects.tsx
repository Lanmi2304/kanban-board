"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Projects } from "@/server/db/schema";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Projects({ projects }: { projects: Projects[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("project-query")?.toLowerCase() || "";

  console.log(projects);
  return (
    <div>
      {projects.filter((project) =>
        project.title.toLowerCase().includes(search),
      ).length === 0 && (
        <div className="flex size-full flex-wrap items-center justify-center">
          <div className="flex items-center gap-2">
            <CircleAlert />
            <span>No projects found</span>
          </div>
        </div>
      )}

      <div className="grid w-full grid-cols-2 gap-2.5 md:grid-cols-4 md:justify-start">
        {projects
          .filter((project) => project.title.toLowerCase().includes(search))
          .map((project) => (
            <Link href={`/dashboard/${project.id}`} key={project.id}>
              <Card
                key={project.id}
                className="hover:bg-accent gap-1.5 overflow-hidden p-0 hover:cursor-pointer"
              >
                <div className="h-20 w-full bg-gradient-to-br from-violet-600 to-[#a94075]"></div>
                <CardHeader className="px-2">
                  <CardTitle className="text-md font-semibold">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative -top-2 px-2 pt-0">
                  <p className="text-muted-foreground line-clamp-1 text-sm">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
