import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Projects } from "@/server/db/schema";
import Link from "next/link";
import Notes from "@/public/images/popular-templates/notes.webp";
import Proposal from "@/public/images/popular-templates/proposal.webp";
import Image, { StaticImageData } from "next/image";

type Template = Omit<Projects, "createdAt" | "updatedAt" | "userId"> & {
  bgImage?: StaticImageData;
};

const templates: Template[] = [
  {
    id: "template-1",
    title: "Kanban Board",
    description: "A simple kanban board template to manage your tasks.",
  },
  {
    id: "template-2",
    title: "Meeting Notes",
    description: "A template for taking notes during meetings.",
    bgImage: Notes,
  },
  {
    id: "template-3",
    title: "Project Proposal",
    description: "A template for creating project proposals.",
    bgImage: Proposal,
  },
];

export function PopularTemplates() {
  return (
    <div className="grid w-full grid-cols-2 gap-2.5 md:grid-cols-4 md:justify-start">
      {templates.map((template) => (
        // <Link href={`/dashboard/${template.id}`} key={template.id}>
        <Card
          key={template.id}
          className="hover:bg-accent gap-1.5 overflow-hidden p-0 hover:cursor-pointer"
        >
          <div className="relative h-20 w-full bg-gradient-to-br bg-cover bg-center bg-no-repeat">
            <Image
              src={
                template.bgImage ||
                "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x322/47f09f0e3910259568294477d0bdedac/photo-1576502200916-3808e07386a5.jpg"
              }
              alt={template.title}
              fill
            />
            <Badge variant="secondary" className="absolute right-2 bottom-2">
              Template
            </Badge>
          </div>
          <CardHeader className="px-2">
            <CardTitle className="text-md font-semibold">
              {template.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative -top-2 px-2 pt-0">
            <p className="text-muted-foreground line-clamp-1 text-sm">
              {template.description}
            </p>
          </CardContent>
        </Card>
        // </Link>
      ))}
    </div>
  );
}
