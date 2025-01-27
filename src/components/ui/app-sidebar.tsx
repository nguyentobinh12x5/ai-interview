import {
  Calendar,
  Home,
  Inbox,
  Settings,
  FileQuestion,
  File,
  Presentation,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Quiz",
    url: "/quiz",
    icon: FileQuestion,
  },
  {
    title: "Mock Interview",
    url: "/mock-interview",
    icon: Inbox,
  },
  {
    title: "Preparation Hub",
    url: "/prepare-hub",
    icon: Calendar,
  },
  {
    title: "Live Interview",
    url: "/live-interview",
    icon: Presentation,
  },
  {
    title: "Resume",
    url: "/resume",
    icon: File,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
