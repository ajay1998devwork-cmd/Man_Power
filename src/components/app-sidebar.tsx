import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <Sidebar collapsible="icon" className="bg-white text-slate-800 border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-100 px-3 py-4">
        <div className="relative flex items-center gap-2.5 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform duration-200 hover:scale-105">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>corporate_fare</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold tracking-tight text-brand">Manpower Command</span>
            <span className="truncate text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400">Central network core</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-brand md:flex group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-x-1/2 group-data-[collapsible=icon]:-translate-y-1/2 group-data-[collapsible=icon]:bg-white/90 group-data-[collapsible=icon]:shadow-sm"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <div className="relative mt-4 group-data-[collapsible=icon]:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search navigation"
            placeholder="Search navigation"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/10"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-5">
        <p className="mb-2 px-3 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-slate-400 group-data-[collapsible=icon]:hidden">Workspace</p>
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
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
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
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="h-9 w-9 shrink-0 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                <span className="text-brand text-sm font-bold uppercase">
                  {user?.email?.substring(0, 2) || 'SA'}
                </span>
              </div>
              <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-800 truncate leading-tight">
                  {user?.email?.split('@')[0] || 'Super Admin'}
                </span>
                <span className="text-xs text-slate-500 truncate">{user?.email || 'admin@manpower.com'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                <span className="text-brand text-sm font-bold uppercase">
                  {user?.email?.substring(0, 2) || 'SA'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors font-medium group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <span className={`material-symbols-outlined shrink-0 ${
              isCollapsed ? 'text-2xl' : 'text-xl'
            }`}>logout</span>
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
