import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { admins } from './super-admin-users';

export const tenantDocuments = pgTable('tenant_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  storageKey: varchar('storage_key', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => admins.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type TenantDocument = typeof tenantDocuments.$inferSelect;
export type NewTenantDocument = typeof tenantDocuments.$inferInsert;
