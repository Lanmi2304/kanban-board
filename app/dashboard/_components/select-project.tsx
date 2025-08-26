"use client";

import * as React from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Search } from "lucide-react";
import { Projects } from "@/server/db/schema";
import { useDebounce } from "@/lib/hooks/use-debounce";

type Props = {
  title: string;
  projects?: Projects[];
};

// const projects: Projects[] = [
//   {
//     value: "project-1",
//     label: "Project 1",
//   },
//   {
//     value: "project-2",
//     label: "Project 2",
//   },
//   {
//     value: "project-3",
//     label: "Project 3",
//   },
//   {
//     value: "project-4",
//     label: "Project 4",
//   },
//   {
//     value: "project-5",
//     label: "Project 5",
//   },
// ];

export function ComboBoxResponsive({ title, projects }: Props) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [selectedStatus, setSelectedStatus] = React.useState<Projects | null>(
    null,
  );

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[150px] cursor-pointer justify-start"
          >
            {selectedStatus ? (
              <>{selectedStatus.title}</>
            ) : (
              <>
                <Search />
                {title}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            setOpen={setOpen}
            setSelectedStatus={setSelectedStatus}
            projects={projects}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.title}</> : <>{title}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            setSelectedStatus={setSelectedStatus}
            projects={projects}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
  projects,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Projects | null) => void;
  projects?: Projects[];
}) {
  const [query, setQuery] = useQueryState("project-query", {
    defaultValue: "",
  });
  const debouncedSearch = useDebounce(query, 300);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    if (!debouncedSearch) return projects;

    return projects.filter((project) =>
      project.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [projects, debouncedSearch]);

  return (
    <Command>
      <CommandInput
        placeholder="Filter projects..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
        <CommandGroup>
          {filteredProjects.map((project) => (
            <CommandItem
              key={project.id}
              value={project.title}
              onSelect={(value) => {
                setSelectedStatus(
                  filteredProjects.find((project) => project.title === value) ||
                    null,
                );
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              {project.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
