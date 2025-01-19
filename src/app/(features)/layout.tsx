"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function FeaturesLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <div className="relative flex flex-1 flex-col gap-3 overflow-auto p-4 lg:gap-4 lg:p-6 lg:pb-6 pb-0 h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
