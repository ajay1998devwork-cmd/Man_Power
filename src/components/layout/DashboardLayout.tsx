import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SidebarProvider defaultOpen={true} className="h-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col overflow-hidden">
          <AppHeader />
          <main className="flex flex-1 flex-col gap-6 bg-[#f8fafc] overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}