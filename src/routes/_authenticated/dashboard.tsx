import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building2, CheckCircle2, Clock3, Plus, ShieldAlert, Users, XCircle } from 'lucide-react';
import { tenantsApi } from '@/lib/api/tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/dashboard')({ component: DashboardPage });

const statCards = [
  { key: 'totalAgencies', label: 'Total agencies', helper: 'Across your network', icon: Building2, iconClass: 'bg-violet-50 text-violet-600' },
  { key: 'activeAgencies', label: 'Active agencies', helper: 'Ready for operations', icon: CheckCircle2, iconClass: 'bg-emerald-50 text-emerald-600' },
  { key: 'suspendedAgencies', label: 'Suspended agencies', helper: 'Require attention', icon: ShieldAlert, iconClass: 'bg-amber-50 text-amber-600' },
  { key: 'inactiveAgencies', label: 'Inactive agencies', helper: 'Archived or dormant', icon: XCircle, iconClass: 'bg-slate-100 text-slate-600' },
] as const;

function DashboardPage() {
  const statsQuery = useQuery({ queryKey: ['dashboard-stats'], queryFn: tenantsApi.getDashboardStats });
  const agenciesQuery = useQuery({ queryKey: ['dashboard-agencies'], queryFn: () => tenantsApi.getAll(1, 5) });
  const stats = statsQuery.data;
  const total = stats?.totalAgencies || 0;

  return (
    <section className="w-full space-y-6 p-5 md:p-8 xl:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-brand md:text-2xl">Dashboard</h1>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">Live console</span>
          </div>
          <p className="text-sm text-slate-500">Manage and monitor your manpower agencies across all operational regions.</p>
        </div>
        <Link to="/tenants/new">
          <Button className="h-10 gap-2 bg-accent px-4 text-xs font-bold text-white shadow-sm shadow-orange-500/20 hover:bg-accent-hover">
            <Plus className="size-4" /> Create agency
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, helper, icon: Icon, iconClass }) => {
          const value = stats?.[key] || 0;
          const ratio = key === 'totalAgencies' || !total ? null : Math.round((value / total) * 100);
          return (
            <Card key={key} className="border-0 bg-white shadow-card transition-shadow hover:shadow-cardHover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${iconClass}`}><Icon className="size-5" /></div>
                  <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">{ratio === null ? 'Network total' : `${ratio}% of total`}</span>
                </div>
                <p className="mt-5 text-3xl font-extrabold tracking-tight text-brand">{value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
                <p className="mt-1 text-xs text-slate-400">{helper}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-0 bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><CardTitle className="text-base text-brand">Agency overview</CardTitle><p className="mt-1 text-xs text-slate-500">Current status across your agency network</p></div>
            <Link to="/tenants"><Button variant="ghost" size="sm" className="gap-1.5 text-xs text-brand">View directory <ArrowRight className="size-3.5" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            {[['Active', stats?.activeAgencies || 0, 'bg-emerald-500', 'text-emerald-600'], ['Suspended', stats?.suspendedAgencies || 0, 'bg-amber-500', 'text-amber-600'], ['Inactive', stats?.inactiveAgencies || 0, 'bg-slate-400', 'text-slate-500']].map(([label, count, bar, text]) => {
              const percent = total ? Math.round((Number(count) / total) * 100) : 0;
              return <div key={label as string} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className={`font-semibold ${text}`}>{count} <span className="text-xs font-normal text-slate-400">({percent}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} /></div></div>;
            })}
            {!total && <p className="rounded-lg border border-dashed border-slate-200 py-3 text-center text-xs text-slate-400">Create an agency to start tracking network health.</p>}
          </CardContent>
        </Card>

        <Card className="border-0 bg-brand text-white shadow-card">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/10"><Users className="size-5 text-orange-300" /></div><h2 className="text-lg font-bold">Build your agency network</h2><p className="mt-2 text-sm leading-6 text-slate-300">Add agencies, provision secure access, and keep regional operations in one place.</p></div>
            <Link to="/tenants/new" className="mt-7"><Button className="w-full gap-2 bg-accent text-white hover:bg-accent-hover"><Plus className="size-4" /> Add your first agency</Button></Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-0 bg-white shadow-card lg:col-span-2">
          <CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-base text-brand">Recommended next steps</CardTitle><p className="mt-1 text-xs text-slate-500">Keep your platform ready for the next agency onboarded.</p></CardHeader>
          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            <Link to="/tenants/new" className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50"><div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-orange-50 text-accent"><Plus className="size-4" /></div><p className="text-sm font-semibold text-brand">Add an agency</p><p className="mt-1 text-xs leading-5 text-slate-500">Create a profile and provision admin access.</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">Get started <ArrowRight className="size-3" /></span></Link>
            <Link to="/tenants" className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"><div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Building2 className="size-4" /></div><p className="text-sm font-semibold text-brand">Review directory</p><p className="mt-1 text-xs leading-5 text-slate-500">Browse agency profiles, contacts, and statuses.</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">Open directory <ArrowRight className="size-3" /></span></Link>
            <div className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-4" /></div><p className="text-sm font-semibold text-brand">Monitor health</p><p className="mt-1 text-xs leading-5 text-slate-500">Keep an eye on active, suspended, and inactive agencies.</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">Live overview</span></div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-slate-100/70 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Platform status</p><p className="mt-3 text-2xl font-bold text-brand">All systems ready</p><p className="mt-2 text-sm leading-6 text-slate-500">Your command center is ready to manage agency operations as your network grows.</p></div><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600"><span className="size-2 rounded-full bg-emerald-500" /> Operational</div></CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-white shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4"><div><CardTitle className="text-base text-brand">Recent agencies</CardTitle><p className="mt-1 text-xs text-slate-500">The latest agencies added to your network</p></div><Clock3 className="size-4 text-slate-400" /></CardHeader>
        <CardContent className="p-0">
          {agenciesQuery.isLoading ? <div className="p-8 text-center text-sm text-slate-400">Loading agencies…</div> : !agenciesQuery.data?.data.length ? <div className="p-8 text-center"><Building2 className="mx-auto size-8 text-slate-300" /><p className="mt-2 text-sm font-semibold text-slate-600">No agencies yet</p><p className="mt-1 text-xs text-slate-400">Your newest agencies will appear here.</p></div> : <div className="divide-y divide-slate-100">{agenciesQuery.data.data.map((agency) => <Link key={agency.id} to="/tenants/$tenantId" params={{ tenantId: agency.id }} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"><div className="flex min-w-0 items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-accent">{agency.name.slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-brand">{agency.name}</p><p className="truncate text-xs text-slate-400">{agency.city}, {agency.state} · {agency.contactPersonName}</p></div></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">{agency.status}</span></Link>)}</div>}
        </CardContent>
      </Card>
    </section>
  );
}
