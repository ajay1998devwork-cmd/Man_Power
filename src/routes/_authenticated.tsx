import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const Route = createFileRoute('/_authenticated')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
