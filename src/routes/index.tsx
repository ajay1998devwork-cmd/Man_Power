import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/me`, {
      credentials: 'include',
    });

    if (response.ok) {
      throw redirect({ to: '/dashboard' });
    } else {
      throw redirect({ to: '/login' });
    }
  },
});
