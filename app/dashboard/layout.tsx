import { ComboBoxResponsive } from "./_components/select-project";
import { getSession } from "@/lib/utils/get-session";
import { getProjects } from "./_repositories/get-projects-repository";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavUser } from "./[slug]/_components/nav-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getSession();
  const userId = data?.user.id;

  // TODO: build a proper not-logged-in state
  if (!userId) {
    return (
      <div>
        <p>You are not logged in.</p>
      </div>
    );
  }

  const projects = await getProjects(userId);

  return (
    // <SidebarInset className="w-fit overflow-hidden">
    <>
      <header className="bg-background fixed top-0 z-20 flex h-16 w-full shrink-0 items-center gap-2 border-b px-2">
        {/* <SidebarTrigger className="-ml-1" /> */}
        {/* <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        /> */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <ComboBoxResponsive title="Select project" projects={projects} />

          <NavUser user={data.user} />
        </div>
      </header>
      <div className="w-full">{children}</div>
    </>
  );
}
