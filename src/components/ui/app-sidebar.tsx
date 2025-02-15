"use client";
import {
  FileQuestion,
  LaptopMinimal,
  CircleUser,
  LaptopMinimalCheck,
  FileText,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Loading from "./loading";

// Menu items.
const items = [
  {
    title: "Live Interview",
    url: "/live-interview",
    icon: LaptopMinimalCheck,
  },
  {
    title: "Mock Interview",
    url: "/mock-interview",
    icon: LaptopMinimal,
  },
  {
    title: "Preparation Hub",
    url: "/prepare-hub",
    icon: CircleUser,
  },
  {
    title: "User Document",
    url: "/resume",
    icon: FileText,
  },
  {
    title: "Quiz",
    url: "/quiz",
    icon: FileQuestion,
  },
  {
    title: "Summarize",
    url: "/summarize",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-semibold">BI</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                Beat Interview
              </span>
            </div>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a
                        href={item.url}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-50 text-gray-600 group-hover:bg-white dark:bg-gray-900 dark:text-gray-400"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="flex flex-col">
              {isLoaded ? (
                <>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                </>
              ) : (
                <Loading />
              )}
            </div>
            <ChevronUp className="ml-auto h-4 w-4 text-gray-500" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
