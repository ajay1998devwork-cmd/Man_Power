import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Building2, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/login')({ component: LoginPage });

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return <main className="flex min-h-screen bg-slate-50">
    <section className="relative hidden w-[45%] overflow-hidden bg-brand p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-blue-400/10" /><div className="absolute -bottom-40 -left-24 size-96 rounded-full bg-accent/10" />
      <div className="relative"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-white text-brand"><Building2 className="size-5" /></div><div><p className="font-bold tracking-tight">Manpower</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">Admin console</p></div></div><div className="mt-24 max-w-md"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Super admin workspace</p><h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">Run your agency network with confidence.</h1><p className="mt-5 text-sm leading-7 text-slate-300">Manage agencies, access, and operational status from one secure command center.</p></div></div>
      <div className="relative space-y-3 text-sm text-slate-300"><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Centralized agency management</div><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Secure owner access provisioning</div><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Built to scale with your business</div></div>
    </section>

    <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[55%] lg:px-12"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-brand text-white"><Building2 className="size-5" /></div><div><p className="font-bold tracking-tight text-brand">Manpower</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Admin console</p></div></div></div><div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Welcome back</p><h2 className="text-2xl font-bold tracking-tight text-brand">Sign in to your workspace</h2><p className="mt-2 text-sm text-slate-500">Use your super admin credentials to continue.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">{error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</div>}<div><label className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="email" placeholder="admin@example.com" className="h-11 border-slate-200 pl-9 shadow-none focus-visible:border-accent focus-visible:ring-orange-100" {...register('email')} /></div>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div><div><label className="mb-1.5 block text-xs font-semibold text-slate-700">Password</label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="password" placeholder="Enter your password" className="h-11 border-slate-200 pl-9 shadow-none focus-visible:border-accent focus-visible:ring-orange-100" {...register('password')} /></div>{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}</div><Button type="submit" disabled={isLoading} className="h-11 w-full gap-2 bg-accent font-semibold text-white shadow-sm shadow-orange-500/20 hover:bg-accent-hover">{isLoading ? 'Signing in…' : <><ShieldCheck className="size-4" /> Sign in securely</>}</Button></form></div><p className="mt-6 text-center text-xs text-slate-400">Authorized access only · Manpower admin platform</p></div></section>
  </main>;
}
