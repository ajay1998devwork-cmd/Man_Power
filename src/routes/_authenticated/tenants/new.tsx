import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forwardRef, useState, type ComponentProps } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building2, CheckCircle2, Copy, KeyRound, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { tenantsApi } from '@/lib/api/tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/tenants/new')({ component: CreateTenantPage });

const schema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Enter a valid email address'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Enter a 10-digit mobile number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Enter a 6-digit pincode'),
});
type FormValues = z.infer<typeof schema>;

type FieldProps = { label: string; error?: string; className?: string } & ComponentProps<typeof Input>;

const Field = forwardRef<HTMLInputElement, FieldProps>(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label} <span className="text-accent">*</span></label>
    <Input ref={ref} {...props} className="h-10 border-slate-200 bg-white text-sm shadow-none focus-visible:border-accent focus-visible:ring-orange-100" />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));

Field.displayName = 'Field';

function CreateTenantPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ agencyCode: string; username: string; temporaryPassword: string } | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const createMutation = useMutation({ mutationFn: tenantsApi.create, onSuccess: (data) => { setCredentials({ ...data.credentials, agencyCode: data.tenant.agencyCode }); queryClient.invalidateQueries({ queryKey: ['tenants'] }); queryClient.invalidateQueries({ queryKey: ['dashboard-agencies'] }); queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }); }, onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create agency') });

  if (credentials) return <SuccessState credentials={credentials} onDirectory={() => navigate({ to: '/tenants' })} onAnother={() => navigate({ to: '/tenants/new' })} />;

  return <section className="w-full space-y-6 p-5 md:p-8 xl:p-10">
    <div className="flex items-start gap-3"><Link to="/tenants"><Button variant="ghost" size="icon" className="mt-0.5 size-9 text-slate-500 hover:text-brand"><ArrowLeft className="size-4" /></Button></Link><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-xl font-bold tracking-tight text-brand md:text-2xl">Create agency</h1><span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">New workspace</span></div><p className="mt-1 text-sm text-slate-500">Set up the agency profile and provision secure admin access.</p></div></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
    <form onSubmit={handleSubmit((data) => { setError(''); createMutation.mutate(data); })} className="space-y-6">
      <Card className="border-0 bg-white shadow-card"><CardHeader className="border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-accent"><Building2 className="size-5" /></div><div><CardTitle className="text-base text-brand">Agency information</CardTitle><p className="mt-1 text-xs text-slate-500">Basic identity and primary contact details</p></div></div></CardHeader><CardContent className="grid gap-5 p-6 md:grid-cols-2"><Field label="Agency name" placeholder="e.g. Apex Frontier Staffing LLP" className="md:col-span-2" error={errors.name?.message} {...register('name')} /><Field label="Primary contact person" placeholder="Full name" error={errors.contactPersonName?.message} {...register('contactPersonName')} /><Field label="Official email" type="email" placeholder="contact@agency.com" error={errors.email?.message} {...register('email')} /><Field label="Mobile number" placeholder="10-digit mobile number" error={errors.mobile?.message} {...register('mobile')} /></CardContent></Card>
      <Card className="border-0 bg-white shadow-card"><CardHeader className="border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><MapPin className="size-5" /></div><div><CardTitle className="text-base text-brand">Registered address</CardTitle><p className="mt-1 text-xs text-slate-500">Used for regional operations and compliance records</p></div></div></CardHeader><CardContent className="grid gap-5 p-6 md:grid-cols-2"><div className="md:col-span-2"><label className="mb-1.5 block text-xs font-semibold text-slate-700">Street address <span className="text-accent">*</span></label><textarea rows={3} placeholder="Unit, building, street and area" className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-orange-100" {...register('address')} />{errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}</div><Field label="City" placeholder="e.g. Mumbai" error={errors.city?.message} {...register('city')} /><Field label="State / jurisdiction" placeholder="e.g. Maharashtra" error={errors.state?.message} {...register('state')} /><Field label="Pincode" placeholder="6-digit pincode" error={errors.pincode?.message} {...register('pincode')} /></CardContent></Card>
      <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center"><Link to="/tenants"><Button type="button" variant="outline" className="border-slate-200 text-slate-600">Cancel</Button></Link><Button type="submit" disabled={createMutation.isPending} className="gap-2 bg-accent px-5 text-white hover:bg-accent-hover">{createMutation.isPending ? 'Creating agency…' : <><ShieldCheck className="size-4" /> Create agency</>}</Button></div>
    </form>
  </section>;
}

function SuccessState({ credentials, onDirectory, onAnother }: { credentials: { agencyCode: string; username: string; temporaryPassword: string }; onDirectory: () => void; onAnother: () => void }) {
  return <section className="mx-auto w-full max-w-2xl p-5 md:p-10"><Card className="border-0 bg-white shadow-card"><CardContent className="p-6 md:p-8"><div className="flex items-start gap-4 border-b border-slate-100 pb-6"><div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-6" /></div><div><h1 className="text-xl font-bold text-brand">Agency created successfully</h1><p className="mt-1 text-sm text-slate-500">The agency profile and admin account are ready.</p></div></div><div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Agency code</p><p className="mt-1 font-mono text-xl font-bold tracking-wider text-brand">{credentials.agencyCode}</p></div><button type="button" onClick={() => navigator.clipboard?.writeText(credentials.agencyCode)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-100" title="Copy agency code"><Copy className="size-4" /></button></div></div><div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><KeyRound className="mt-0.5 size-4 shrink-0 text-amber-600" /><p className="text-sm font-medium leading-5 text-amber-800">Save these credentials securely. The temporary password will not be shown again.</p></div></div><div className="mt-6 space-y-4"><Credential label="Username" value={credentials.username} /><Credential label="Temporary password" value={credentials.temporaryPassword} /></div><div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row"><Button onClick={onDirectory} className="bg-accent text-white hover:bg-accent-hover">View all agencies</Button><Button onClick={onAnother} variant="outline" className="border-slate-200 text-slate-600">Create another</Button></div></CardContent></Card></section>;
}

function Credential({ label, value }: { label: string; value: string }) { return <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label><div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm font-semibold text-brand"><span className="flex items-center gap-2"><UserRound className="size-4 text-slate-400" />{value}</span><button type="button" onClick={() => navigator.clipboard?.writeText(value)} className="text-slate-400 hover:text-accent" title="Copy"><Copy className="size-4" /></button></div></div>; }
