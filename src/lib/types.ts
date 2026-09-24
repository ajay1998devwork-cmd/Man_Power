export interface SuperAdminUser {
  id: string;
  email: string;
  status: string;
  lastLoginAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  contactPersonName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface TenantAccount {
  id: string;
  username: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  mustChangePassword: boolean;
  lastLoginAt?: string;
  passwordChangedAt?: string;
}

export interface TenantDocument {
  id: string;
  tenantId: string;
  documentType: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

export interface TenantDetails extends Tenant {
  account: TenantAccount | null;
  documents: TenantDocument[];
}

export interface CreateTenantDto {
  name: string;
  contactPersonName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateTenantResponse {
  tenant: Tenant;
  credentials: {
    username: string;
    temporaryPassword: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalAgencies: number;
  activeAgencies: number;
  suspendedAgencies: number;
  inactiveAgencies: number;
}
