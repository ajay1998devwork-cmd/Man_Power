import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { tenantsApi } from '@/lib/api/tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Route = createFileRoute('/_authenticated/tenants/$tenantId')({
  component: TenantDetailsPage,
});

function TenantDetailsPage() {
  const { tenantId } = Route.useParams();
  const queryClient = useQueryClient();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantsApi.getById(tenantId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => tenantsApi.updateStatus(tenantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      tenantsApi.uploadDocument(tenantId, file, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      setUploadFile(null);
      setDocumentType('');
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-success-100 text-success-800 border-2 border-success-400',
      PENDING: 'bg-gold-100 text-gold-800 border-2 border-gold-400',
      SUSPENDED: 'bg-accent-100 text-accent-800 border-2 border-accent-400',
      INACTIVE: 'bg-navy-100 text-navy-800 border-2 border-navy-400',
    };
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1>{tenant.name}</h1>
          <p className="text-navy-600 mt-2">Agency Details & Management</p>
        </div>
        {getStatusBadge(tenant.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Agency Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Contact Person</p>
              <p className="text-base text-navy-800 font-semibold mt-2">{tenant.contactPersonName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Email</p>
              <p className="text-base text-navy-800 font-semibold mt-2">{tenant.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Mobile</p>
              <p className="text-base text-navy-800 font-semibold mt-2">{tenant.mobile}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Address</p>
              <p className="text-base text-navy-800 font-semibold mt-2">
                {tenant.address}, {tenant.city}, {tenant.state} - {tenant.pincode}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Created</p>
              <p className="text-base text-navy-800 font-semibold mt-2">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {tenant.account ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Username</p>
                  <p className="text-base text-navy-800 font-mono font-bold mt-2">{tenant.account.username}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Account Status</p>
                  <p className="text-base mt-2">{getStatusBadge(tenant.account.status)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Must Change Password</p>
                  <p className="text-base text-navy-800 font-semibold mt-2">
                    {tenant.account.mustChangePassword ? 'Yes' : 'No'}
                  </p>
                </div>
                {tenant.account.lastLoginAt && (
                  <div>
                    <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Last Login</p>
                    <p className="text-base text-navy-800 font-semibold mt-2">
                      {new Date(tenant.account.lastLoginAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-navy-600">No account information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="sm"
              disabled={tenant.status === 'ACTIVE' || statusMutation.isPending}
              onClick={() => statusMutation.mutate({ status: 'ACTIVE' })}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={tenant.status === 'SUSPENDED' || statusMutation.isPending}
              onClick={() => statusMutation.mutate({ status: 'SUSPENDED' })}
            >
              Suspend
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={tenant.status === 'INACTIVE' || statusMutation.isPending}
              onClick={() => statusMutation.mutate({ status: 'INACTIVE' })}
            >
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">Document Type</label>
              <select
                className="w-full px-4 py-2.5 text-base border-2 border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-navy-800"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="">Select document type</option>
                <option value="Registration Certificate">Registration Certificate</option>
                <option value="GST Certificate">GST Certificate</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Other">Other Business Document</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">Upload File</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 text-base border-2 border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-navy-800"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              disabled={!uploadFile || !documentType || uploadMutation.isPending}
              onClick={() => {
                if (uploadFile && documentType) {
                  uploadMutation.mutate({ file: uploadFile, type: documentType });
                }
              }}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>

          {tenant.documents.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-4 uppercase tracking-wider">Uploaded Documents</h4>
              <div className="space-y-3">
                {tenant.documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-navy-50 rounded-lg border border-navy-200 hover:border-accent-500 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-navy-800">{doc.documentType}</p>
                      <p className="text-xs text-navy-600 mt-1">{doc.fileName}</p>
                    </div>
                    <p className="text-xs text-navy-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-navy-600">No documents uploaded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
