import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { tenantsApi } from '@/lib/api/tenants';

export const Route = createFileRoute('/_authenticated/tenants/')({
  component: TenantsListPage,
});

function TenantsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tenants', page, search],
    queryFn: () => tenantsApi.getAll(page, 20, search),
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      PENDING: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
      SUSPENDED: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
      INACTIVE: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    };
    return (
      <span className={`h-[22px] px-2 py-0.5 rounded-DEFAULT text-[0.6875rem] font-mono uppercase tracking-wider font-semibold inline-block ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <section className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-5">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">Agencies Directory</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Full registry of credentialed manpower partners, SLAs, and placement pipelines.</p>
        </div>
        <Link to="/tenants/new">
          <button className="h-9 px-4 rounded-DEFAULT bg-secondary-container text-surface-container-lowest font-label-lg font-semibold flex items-center gap-2 hover:bg-[#ea580c] transition-all shadow-sm shadow-secondary-container/20">
            <span className="material-symbols-outlined text-base font-bold">add</span>
            <span>+ Create Agency</span>
          </button>
        </Link>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="p-4 bg-surface-container rounded-DEFAULT border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-12 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              className="w-full h-[38px] pl-9 pr-4 text-body-sm font-body-sm bg-surface-container-lowest border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
              placeholder="Search agencies by name, email, code..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        {/* Result Count Meta */}
        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/60 text-label-sm font-label-sm text-outline">
          <span className="font-mono text-tertiary">
            {data ? `Showing ${data.data.length} agencies` : 'Loading...'}
          </span>
          {data && data.pagination.totalPages > 1 && (
            <span className="font-mono">Page {data.pagination.page} of {data.pagination.totalPages}</span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container rounded-DEFAULT border border-outline-variant overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-tertiary text-base">table_chart</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold">Recent Agencies Monitored</h2>
          </div>
          <span className="text-label-sm font-label-sm text-outline font-mono">
            {data ? `${data.pagination.total} total units` : ''}
          </span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16 text-on-surface-variant text-body-md font-body-md">Loading agencies...</div>
        ) : !data?.data.length ? (
          <div className="p-8 rounded-DEFAULT bg-surface-container-low border border-dashed border-outline text-center space-y-3">
            <div className="w-12 h-12 rounded-DEFAULT bg-primary-container text-secondary-container mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">folder_open</span>
            </div>
            <h2 className="text-headline-md font-headline-md text-on-surface">No agencies yet</h2>
            <p className="text-body-md font-body-md text-outline max-w-md mx-auto">Create your first manpower agency to get started with credentialing, deployment tracking, and regional node allocation.</p>
            <Link to="/tenants/new">
              <button className="mt-2 h-9 px-4 rounded-DEFAULT bg-secondary-container text-surface-container-lowest font-label-lg font-semibold inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Create Agency Now
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="h-9 bg-[#091B33] text-outline text-[0.6875rem] uppercase font-mono tracking-wider border-b border-outline-variant">
                    <th className="px-5 font-semibold">Agency & Code</th>
                    <th className="px-4 font-semibold hidden md:table-cell">Primary Contact</th>
                    <th className="px-4 font-semibold">Location</th>
                    <th className="px-4 font-semibold">Status</th>
                    <th className="px-4 font-semibold hidden lg:table-cell">Created</th>
                    <th className="px-5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 text-body-sm font-body-sm">
                  {data.data.map((tenant, index) => (
                    <tr key={tenant.id} className={`h-12 ${index % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'} hover:bg-[#12335C] transition-colors`}>
                      <td className="px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-DEFAULT bg-primary-container text-secondary flex items-center justify-center font-bold text-xs">
                            {tenant.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link to="/tenants/$tenantId" params={{ tenantId: tenant.id }}>
                              <div className="font-medium text-on-surface hover:text-secondary-container cursor-pointer">{tenant.name}</div>
                            </Link>
                            <div className="text-[0.625rem] text-outline font-mono">ID: {tenant.id.substring(0, 12)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 text-on-surface-variant hidden md:table-cell">
                        <div>{tenant.contactPersonName}</div>
                        <div className="text-[0.625rem] text-outline">{tenant.email}</div>
                      </td>
                      <td className="px-4">
                        <span className="inline-flex items-center gap-1 text-on-surface font-medium">
                          <span className="material-symbols-outlined text-xs text-outline">location_on</span>
                          {tenant.city}, {tenant.state}
                        </span>
                      </td>
                      <td className="px-4">{getStatusBadge(tenant.status)}</td>
                      <td className="px-4 text-on-surface-variant hidden lg:table-cell">
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 text-right">
                        <Link to="/tenants/$tenantId" params={{ tenantId: tenant.id }}>
                          <button className="p-1 rounded-DEFAULT text-on-surface-variant hover:text-secondary-container hover:bg-surface-container-high transition-colors" title="Inspect Agency">
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-DEFAULT border-t border-outline-variant">
                <div className="text-body-sm font-body-sm text-outline">
                  Showing <span className="text-on-surface font-semibold">{((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)}</span> of {data.pagination.total} agencies
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    className="h-8 px-2.5 rounded-DEFAULT bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface text-label-sm font-label-sm disabled:opacity-40"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`h-8 w-8 rounded-DEFAULT text-label-sm font-label-sm ${
                          page === pageNum
                            ? 'bg-secondary-container text-surface-container-lowest font-bold'
                            : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high'
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="h-8 px-2.5 rounded-DEFAULT bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high text-label-sm font-label-sm disabled:opacity-40"
                    disabled={page === data.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
