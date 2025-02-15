"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function FeaturesLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen">
          <SidebarTrigger />
          <div className="relative flex-1 flex flex-col gap-3 p-4 lg:gap-4 lg:p-6 pb-0 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
