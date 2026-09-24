import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, ilike, or, desc, asc, count } from 'drizzle-orm';
import { db } from '../../database/db';
import { tenants, tenantAccounts, tenantDocuments } from '../../database/schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto';
import { PasswordUtil } from '../../common/utils/password.util';
import { SlugUtil } from '../../common/utils/slug.util';
import { AuditService } from '../audit/audit.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly auditService: AuditService,
    private readonly storageService: StorageService,
  ) {}

  async create(createTenantDto: CreateTenantDto, userId: string) {
    const slug = SlugUtil.generate(createTenantDto.name);
    const username = SlugUtil.generateUsername(createTenantDto.name);

    const existingSlug = await db.query.tenants.findFirst({
      where: eq(tenants.slug, slug),
    });

    if (existingSlug) {
      throw new BadRequestException('An agency with a similar name already exists');
    }

    const existingUsername = await db.query.tenantAccounts.findFirst({
      where: eq(tenantAccounts.username, username),
    });

    if (existingUsername) {
      throw new BadRequestException('Username already exists. Please use a different agency name.');
    }

    const temporaryPassword = PasswordUtil.generate(16);
    const passwordHash = await PasswordUtil.hash(temporaryPassword);

    let tenant;
    let account;

    try {
      const [newTenant] = await db.insert(tenants).values({
        ...createTenantDto,
        slug,
        status: 'ACTIVE',
      }).returning();

      tenant = newTenant;

      const [newAccount] = await db.insert(tenantAccounts).values({
        tenantId: tenant.id,
        username,
        passwordHash,
        status: 'ACTIVE',
        mustChangePassword: true,
      }).returning();

      account = newAccount;

      await this.auditService.log({
        actorType: 'SUPER_ADMIN',
        actorId: userId,
        action: 'TENANT_CREATED',
        entityType: 'TENANT',
        entityId: tenant.id,
        metadata: { tenantName: tenant.name },
      });

      await this.auditService.log({
        actorType: 'SUPER_ADMIN',
        actorId: userId,
        action: 'TENANT_ACCOUNT_CREATED',
        entityType: 'TENANT_ACCOUNT',
        entityId: account.id,
        metadata: { tenantId: tenant.id, username },
      });

      return {
        tenant,
        credentials: {
          username,
          temporaryPassword,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to create tenant');
    }
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? or(
          ilike(tenants.name, `%${search}%`),
          ilike(tenants.contactPersonName, `%${search}%`),
          ilike(tenants.email, `%${search}%`),
          ilike(tenants.mobile, `%${search}%`)
        )
      : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(tenants)
      .where(whereCondition);

    const results = await db.query.tenants.findMany({
      where: whereCondition,
      limit,
      offset,
      orderBy: [desc(tenants.createdAt)],
    });

    return {
      data: results,
      pagination: {
        page,
        limit,
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / limit),
      },
    };
  }

  async findOne(id: string) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, id),
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const account = await db.query.tenantAccounts.findFirst({
      where: eq(tenantAccounts.tenantId, id),
    });

    const documents = await db.query.tenantDocuments.findMany({
      where: eq(tenantDocuments.tenantId, id),
      orderBy: [desc(tenantDocuments.createdAt)],
    });

    return {
      ...tenant,
      account: account ? {
        id: account.id,
        username: account.username,
        status: account.status,
        mustChangePassword: account.mustChangePassword,
        lastLoginAt: account.lastLoginAt,
        passwordChangedAt: account.passwordChangedAt,
      } : null,
      documents,
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateTenantStatusDto, userId: string) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, id),
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const [updated] = await db
      .update(tenants)
      .set({ 
        status: updateStatusDto.status,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, id))
      .returning();

    let action = 'TENANT_STATUS_UPDATED';
    if (updateStatusDto.status === 'ACTIVE') action = 'TENANT_ACTIVATED';
    if (updateStatusDto.status === 'SUSPENDED') action = 'TENANT_SUSPENDED';
    if (updateStatusDto.status === 'INACTIVE') action = 'TENANT_DEACTIVATED';

    await this.auditService.log({
      actorType: 'SUPER_ADMIN',
      actorId: userId,
      action,
      entityType: 'TENANT',
      entityId: id,
      metadata: { 
        oldStatus: tenant.status,
        newStatus: updateStatusDto.status,
      },
    });

    return updated;
  }

  async uploadDocument(
    tenantId: string,
    file: Express.Multer.File,
    documentType: string,
    userId: string,
  ) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const validation = this.storageService.validateFile(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    const storageKey = await this.storageService.store(file, `tenants/${tenantId}`);

    const [document] = await db.insert(tenantDocuments).values({
      tenantId,
      documentType,
      fileName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedBy: userId,
    }).returning();

    await this.auditService.log({
      actorType: 'SUPER_ADMIN',
      actorId: userId,
      action: 'TENANT_DOCUMENT_UPLOADED',
      entityType: 'TENANT_DOCUMENT',
      entityId: document.id,
      metadata: { 
        tenantId,
        documentType,
        fileName: file.originalname,
      },
    });

    return document;
  }

  async getDashboardStats() {
    const [totalResult] = await db.select({ count: count() }).from(tenants);
    const [activeResult] = await db.select({ count: count() }).from(tenants).where(eq(tenants.status, 'ACTIVE'));
    const [suspendedResult] = await db.select({ count: count() }).from(tenants).where(eq(tenants.status, 'SUSPENDED'));
    const [inactiveResult] = await db.select({ count: count() }).from(tenants).where(eq(tenants.status, 'INACTIVE'));

    return {
      totalAgencies: totalResult.count,
      activeAgencies: activeResult.count,
      suspendedAgencies: suspendedResult.count,
      inactiveAgencies: inactiveResult.count,
    };
  }
}
