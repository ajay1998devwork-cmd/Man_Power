import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Plus, Search, Building2, CheckCircle2, PauseCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function PageContainer({ children }: { children: ReactNode }) {
  return <section className="mx-auto w-full max-w-[1440px] space-y-6 p-4 md:p-6 lg:p-8">{children}</section>;
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div>{action}</div>;
}

const statIcons = { total: Building2, active: CheckCircle2, suspended: AlertTriangle, inactive: PauseCircle };
export function StatCard({ label, value, hint, tone = 'total' }: { label: string; value: number; hint: string; tone?: keyof typeof statIcons }) {
  const Icon = statIcons[tone];
  return <Card className="shadow-sm"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></div><div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon className="size-5" /></div></CardContent></Card>;
}

export function SearchField({ value, onChange, placeholder = 'Search agencies...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="relative w-full"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 pl-9" /></div>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : status === 'SUSPENDED' || status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-muted text-muted-foreground border-border';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{status}</span>;
}

export function PrimaryAction({ to, children = 'Create Agency' }: { to: '/tenants/new'; children?: ReactNode }) {
  return <Button asChild className="bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"><Link to={to}><Plus data-icon="inline-start" />{children}</Link></Button>;
}

export function QuickLink({ to, children }: { to: '/tenants' | '/tenants/new'; children: ReactNode }) {
  return <Button asChild variant="outline"><Link to={to}>{children}<ArrowRight data-icon="inline-end" /></Link></Button>;
}

export function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4"><CardTitle className="text-base">{title}</CardTitle>{action}</CardHeader><CardContent className="p-0">{children}</CardContent></Card>;
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <div className="flex flex-col gap-1.5"><label className="text-sm font-medium text-foreground">{label}</label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>;
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Card><CardHeader className="border-b border-border px-5 py-4"><CardTitle className="text-base">{title}</CardTitle>{description && <p className="text-sm text-muted-foreground">{description}</p>}</CardHeader><CardContent className="grid gap-5 p-5 md:grid-cols-2">{children}</CardContent></Card>;
}

export const inputClass = 'h-10 bg-background';
export const selectClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';
export const tableClass = 'w-full min-w-[760px] text-left text-sm';
export const tableHeadClass = 'border-b bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground';
export const tableCellClass = 'border-b border-border px-4 py-3.5 align-middle';
export const emptyStateClass = 'flex flex-col items-center justify-center gap-2 px-6 py-16 text-center';
export const iconButtonClass = 'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
export const primaryIcon = <Building2 className="size-5" />;
export const actionIcon = <ArrowRight className="size-4" />;
export const successIcon = <CheckCircle2 className="size-5" />;
export const warningIcon = <AlertTriangle className="size-5" />;
export const pauseIcon = <PauseCircle className="size-5" />;
export const addIcon = <Plus className="size-4" />;
export const searchIcon = <Search className="size-4" />;

export default {
  PageContainer,
  PageHeader,
  StatCard,
  SearchField,
  StatusBadge,
  PrimaryAction,
  QuickLink,
  SectionCard,
  Field,
  FormSection,
};
