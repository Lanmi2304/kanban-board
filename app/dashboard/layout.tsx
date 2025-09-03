import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ComboBoxResponsive } from "./_components/select-project";
import { getSession } from "@/lib/utils/get-session";
import { getProjects } from "./_repositories/get-projects-repository";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <SidebarProvider>
      <AppSidebar user={data.user} />
      <SidebarInset className="mb-10 w-fit overflow-x-hidden">
        <header className="bg-background fixed top-0 z-20 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <ComboBoxResponsive title="Select project" projects={projects} />
        </header>
        <div className="w-full px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
