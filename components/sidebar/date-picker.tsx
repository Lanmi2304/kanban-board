// import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { SideBarCalendar } from "../sidebar-calendar";

export function DatePicker() {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SideBarCalendar />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
