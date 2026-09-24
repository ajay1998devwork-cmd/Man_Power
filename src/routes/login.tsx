import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1e3e] via-[#0f2847] to-[#1a3a5c] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-secondary-container rounded-xl mb-5 shadow-xl">
            <span className="material-symbols-outlined text-surface-container-lowest" style={{ fontSize: '3.5rem' }}>corporate_fare</span>
          </div>
          <h1 className="text-display-mobile font-display-mobile text-on-surface mb-2">
            Super Admin Platform
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Manpower Management System
          </p>
        </div>

        <div className="bg-surface-container rounded-lg border border-outline-variant shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-container to-[#0f2d5d] px-6 py-4 border-b border-outline-variant">
            <h2 className="text-headline-md font-headline-md text-on-surface font-semibold">Sign In to Continue</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-4 bg-error-container/20 border border-error rounded-DEFAULT">
                  <p className="text-body-md font-body-md text-error font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-label-md font-label-md text-on-surface font-semibold">
                  Email
                </label>
                <input
                  className="w-full h-[42px] px-3 text-body-md font-body-md bg-surface-container-low border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20"
                  type="email"
                  placeholder="admin@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-[0.6875rem] text-error">{errors.email.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-md font-label-md text-on-surface font-semibold">
                  Password
                </label>
                <input
                  className="w-full h-[42px] px-3 text-body-md font-body-md bg-surface-container-low border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20"
                  type="password"
                  placeholder="••••••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <span className="text-[0.6875rem] text-error">{errors.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-DEFAULT bg-secondary-container text-surface-container-lowest font-headline-sm font-semibold hover:bg-[#ea580c] transition-all shadow-md shadow-secondary-container/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
