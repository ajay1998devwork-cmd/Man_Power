import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TenantStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export class UpdateTenantStatusDto {
  @IsEnum(TenantStatus)
  @IsNotEmpty()
  status: TenantStatus;
}
