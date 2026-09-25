import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/me`, {
        credentials: 'include',
      });

      throw redirect({ to: response.ok ? '/dashboard' : '/login' });
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }

      throw redirect({ to: '/login' });
    }
  },
});
