import { Injectable } from '@nestjs/common';
import { db } from '../../database/db';
import { auditLogs } from '../../database/schema';

export interface CreateAuditLogDto {
  actorType: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  async log(data: CreateAuditLogDto): Promise<void> {
    try {
      await db.insert(auditLogs).values(data);
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }
}
