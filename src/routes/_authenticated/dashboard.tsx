import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { tenantsApi } from '@/lib/api/tenants';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => tenantsApi.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <section className="page-container flex flex-col gap-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand">Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[0.6875rem] font-bold tracking-wide border border-blue-100">LIVE CONSOLE</span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">Manage and monitor your manpower agencies across all nationwide operational nodes.</p>
        </div>
        <Link to="/tenants/new">
          <button className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm shadow-blue-600/25">
            <span className="material-symbols-outlined text-base font-bold">add</span>
            <span>+ Create Agency</span>
          </button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Total Agencies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">corporate_fare</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">trending_up</span> +4 this month
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-brand tracking-tight">{stats?.totalAgencies || 0}</span>
            <div className="text-xs font-semibold text-slate-700 mt-1">Total Agencies</div>
            <p className="text-[0.75rem] text-slate-400 mt-0.5">Unified agency ecosystem</p>
          </div>
        </div>

        {/* Card 2: Active Agencies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <span className="inline-flex items-center text-[0.6875rem] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats?.totalAgencies ? Math.round((stats.activeAgencies / stats.totalAgencies) * 100) : 0}% of total
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-brand tracking-tight">{stats?.activeAgencies || 0}</span>
            <div className="text-xs font-semibold text-slate-700 mt-1">Active Agencies</div>
            <p className="text-[0.75rem] text-slate-400 mt-0.5">Normal operational routing</p>
          </div>
        </div>

        {/* Card 3: Suspended Agencies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <span className="inline-flex items-center text-[0.6875rem] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Needs attention
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-brand tracking-tight">{stats?.suspendedAgencies || 0}</span>
            <div className="text-xs font-semibold text-slate-700 mt-1">Suspended Agencies</div>
            <p className="text-[0.75rem] text-slate-400 mt-0.5">Compliance &amp; audit pending</p>
          </div>
        </div>

        {/* Card 4: Inactive Agencies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">pause_circle</span>
            </div>
            <span className="inline-flex items-center text-[0.6875rem] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {stats?.totalAgencies ? Math.round((stats.inactiveAgencies / stats.totalAgencies) * 100) : 0}% of total
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-brand tracking-tight">{stats?.inactiveAgencies || 0}</span>
            <div className="text-xs font-semibold text-slate-700 mt-1">Inactive Agencies</div>
            <p className="text-[0.75rem] text-slate-400 mt-0.5">Dormant licenses / archived</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">QUICK ACTIONS:</span>
        <Link to="/tenants/new">
          <button className="h-9 px-4 text-xs font-semibold rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">add</span> Add New Agency
          </button>
        </Link>
        <Link to="/tenants">
          <button className="h-9 px-4 text-xs font-semibold rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
            <span>View All Agencies</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </Link>
      </div>
    </section>
  );
}
