import { Link, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/tenants', label: 'Agencies', icon: 'corporate_fare', badge: null },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white text-slate-800 shadow-[4px_0_24px_-20px_rgba(15,23,42,0.35)]">
      <SidebarHeader className="border-b border-slate-100/90 px-3 py-4">
        <div className="relative flex min-h-10 items-center gap-3 px-1">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_18px_-8px] shadow-brand/60 transition-transform duration-200 hover:scale-105">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}>corporate_fare</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[0.9rem] font-bold tracking-tight text-slate-900">Manpower Command</span>
            <span className="truncate text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-brand md:flex group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-x-1/2 group-data-[collapsible=icon]:-translate-y-1/2 group-data-[collapsible=icon]:bg-white group-data-[collapsible=icon]:shadow-sm"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <div className="relative mt-5 group-data-[collapsible=icon]:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search navigation"
            placeholder="Search navigation"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <p className="mb-3 px-3 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-slate-400 group-data-[collapsible=icon]:hidden">Workspace</p>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map(({ to, label, icon, badge }) => {
                const isActive = pathname.startsWith(to);
                return (
                  <SidebarMenuItem key={to}>
                    <Link 
                      to={to} 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? 'bg-accent/10 text-accent font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-0.5 font-medium'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? label : undefined}
                    >
                      <span className={`material-symbols-outlined shrink-0 ${
                        isCollapsed ? 'text-2xl' : 'text-xl'
                      }`}>{icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="text-sm truncate">{label}</span>
                          {badge && (
                            <span className="ml-auto text-[0.625rem] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold shrink-0">{badge}</span>
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-3">
        <div className="space-y-3">
          <div className={`flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-2 shadow-sm ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
              <span className="text-sm font-bold uppercase text-brand">MP</span>
            </div>
            {!isCollapsed && (
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold leading-tight text-slate-800">Manpower Admin</span>
                <span className="truncate text-xs text-slate-500">Workspace owner</span>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
