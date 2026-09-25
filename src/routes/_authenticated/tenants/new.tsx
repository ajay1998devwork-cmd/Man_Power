import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/lib/api/tenants';

export const Route = createFileRoute('/_authenticated/tenants/new')({
  component: CreateTenantPage,
});

const createTenantSchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be a 10-digit number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be a 6-digit number'),
});

type CreateTenantForm = z.infer<typeof createTenantSchema>;

function CreateTenantPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ username: string; temporaryPassword: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantForm>({
    resolver: zodResolver(createTenantSchema),
  });

  const createMutation = useMutation({
    mutationFn: tenantsApi.create,
    onSuccess: (data) => {
      setCredentials(data.credentials);
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create agency');
    },
  });

  const onSubmit = async (data: CreateTenantForm) => {
    setError('');
    createMutation.mutate(data);
  };

  if (credentials) {
    return (
      <section className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="p-6 bg-surface-container rounded-DEFAULT border border-outline-variant space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
            <div>
              <h1 className="text-headline-md font-headline-md text-on-surface font-bold">Agency Created Successfully!</h1>
              <p className="text-body-sm font-body-sm text-outline">Cryptographic provisioning complete. Credentials generated.</p>
            </div>
          </div>

          <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-DEFAULT">
            <p className="text-body-md font-body-md text-emerald-400 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">verified</span>
              The agency has been successfully initialized. Here are the login credentials:
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-label-md font-label-md text-on-surface font-semibold mb-2">Username</label>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-DEFAULT font-mono text-body-lg text-tertiary font-semibold">
                {credentials.username}
              </div>
            </div>

            <div>
              <label className="block text-label-md font-label-md text-on-surface font-semibold mb-2">Temporary Password</label>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-DEFAULT font-mono text-body-lg text-tertiary font-semibold">
                {credentials.temporaryPassword}
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-200 rounded-DEFAULT">
            <p className="text-body-md font-body-md text-secondary-container font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Save these credentials securely. The temporary password will not be shown again.
            </p>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">
              The tenant will be required to change their password on first login.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant">
            <button
              className="h-9 px-4 rounded-DEFAULT bg-secondary-container text-surface-container-lowest font-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all"
              onClick={() => navigate({ to: '/tenants' })}
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              View All Agencies
            </button>
            <button
              className="h-9 px-4 rounded-DEFAULT bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors font-label-lg font-medium flex items-center justify-center gap-2"
              onClick={() => navigate({ to: '/tenants/new' })}
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create Another Agency
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/tenants">
              <button className="p-1 rounded-DEFAULT text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-base">arrow_back</span>
              </button>
            </Link>
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">Register New Agency</h1>
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Configure credentials, regional jurisdiction, and primary master admin profile.</p>
        </div>
        <span className="text-label-sm font-label-sm text-outline font-mono hidden sm:inline-block">FORM_SCHEMA: v2.4</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-5 bg-error-container/20 border border-error rounded-DEFAULT">
            <p className="text-body-md font-body-md text-error font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </p>
          </div>
        )}

        {/* SECTION A: Agency Information */}
        <div className="p-6 bg-surface-container rounded-DEFAULT border border-outline-variant space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
            <span className="material-symbols-outlined text-secondary-container text-lg">business</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold">1. Agency Information</h2>
            <span className="text-label-sm font-label-sm text-outline ml-auto">Legal and spatial footprint</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agency Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Agency Name <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="e.g. Apex Frontier Staffing LLP"
                {...register('name')}
              />
              {errors.name && (
                <span className="text-[0.6875rem] text-error">{errors.name.message}</span>
              )}
              <span className="text-[0.6875rem] text-outline">Registered company name as per MCA / Labor Bureau certificate</span>
            </div>

            {/* Contact Person Name */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Contact Person Name <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="Full Name of Primary Principal"
                {...register('contactPersonName')}
              />
              {errors.contactPersonName && (
                <span className="text-[0.6875rem] text-error">{errors.contactPersonName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Official Email Address <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="principal@agency.domain"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-[0.6875rem] text-error">{errors.email.message}</span>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Mobile Number <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="9800000000"
                {...register('mobile')}
              />
              {errors.mobile && (
                <span className="text-[0.6875rem] text-error">{errors.mobile.message}</span>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Corporate Physical Address <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="Unit #, Tech Park, Street Address"
                {...register('address')}
              />
              {errors.address && (
                <span className="text-[0.6875rem] text-error">{errors.address.message}</span>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                City <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="e.g. Mumbai, Bengaluru, Pune"
                {...register('city')}
              />
              {errors.city && (
                <span className="text-[0.6875rem] text-error">{errors.city.message}</span>
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                State / Jurisdiction <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="e.g. Maharashtra, Karnataka"
                {...register('state')}
              />
              {errors.state && (
                <span className="text-[0.6875rem] text-error">{errors.state.message}</span>
              )}
            </div>

            {/* Pincode */}
            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Postal Pincode <span className="text-secondary-container">*</span>
              </label>
              <input
                className="w-full h-[38px] px-3 text-body-sm font-body-sm bg-[#081A30] border border-outline-variant rounded-DEFAULT text-on-surface placeholder:text-outline focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
                placeholder="6-digit PIN"
                {...register('pincode')}
              />
              {errors.pincode && (
                <span className="text-[0.6875rem] text-error">{errors.pincode.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
          <Link to="/tenants">
            <button
              className="h-9 px-4 rounded-DEFAULT bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors font-label-lg font-medium"
              type="button"
            >
              Cancel
            </button>
          </Link>
          <button
            className="h-9 px-6 rounded-DEFAULT bg-secondary-container text-surface-container-lowest font-headline-sm font-semibold hover:bg-[#ea580c] transition-all shadow-sm shadow-secondary-container/20 flex items-center gap-2 disabled:opacity-50"
            type="submit"
            disabled={createMutation.isPending}
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{createMutation.isPending ? 'Creating...' : 'Create Agency'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
