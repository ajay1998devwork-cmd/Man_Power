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
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      <SidebarHeader className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>corporate_fare</span>
            </div>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold tracking-tight text-brand leading-tight truncate">Manpower Command</span>
              <span className="text-[0.625rem] tracking-wider text-slate-400 uppercase font-semibold truncate">CENTRAL NETWORK CORE</span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
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
    </Sidebar>
  );
}
