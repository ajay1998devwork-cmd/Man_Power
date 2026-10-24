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
  useSidebar,
} from '@/components/ui/sidebar';
import { Building2, ChevronLeft, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tenants', label: 'Agencies', icon: Building2 },
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
    <Sidebar collapsible="icon" className="border-slate-200 bg-white text-slate-800">
      <SidebarHeader className="relative border-b border-slate-100 px-3 py-4 group-data-[collapsible=icon]:px-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <Building2 className="size-[18px]" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-bold tracking-tight text-brand">Manpower</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Admin console</p>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              'ml-auto flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              'group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-3 group-data-[collapsible=icon]:top-4 group-data-[collapsible=icon]:z-20 group-data-[collapsible=icon]:bg-white group-data-[collapsible=icon]:shadow-sm group-data-[collapsible=icon]:ring-1 group-data-[collapsible=icon]:ring-slate-200'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-5 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 group-data-[collapsible=icon]:hidden">Workspace</p>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = pathname.startsWith(to);
                return (
                  <SidebarMenuItem key={to}>
                    <Link
                      to={to}
                      title={isCollapsed ? label : undefined}
                      className={cn(
                        'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2',
                        isActive
                          ? 'bg-orange-50 font-semibold text-accent'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                      )}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-3 group-data-[collapsible=icon]:px-2">
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
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="size-[18px] shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Log out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
