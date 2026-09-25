import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-7">
      <SidebarTrigger className="rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand md:hidden" />
      <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
        <span className="font-medium">Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">Overview</span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden w-full max-w-xs lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80 pl-9 pr-4 text-sm transition-colors hover:border-slate-300 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-slate-500">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                <span className="text-brand text-xs font-bold uppercase">
                  {user?.email?.substring(0, 2) || 'SA'}
                </span>
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.email?.split('@')[0] || 'Super Admin'}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || 'admin@manpower.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
