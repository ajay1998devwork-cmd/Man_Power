import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const tenantAccountStatusEnum = pgEnum('tenant_account_status', ['ACTIVE', 'SUSPENDED', 'INACTIVE']);

export const tenantAccounts = pgTable('tenant_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().unique().references(() => tenants.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  status: tenantAccountStatusEnum('status').notNull().default('ACTIVE'),
  mustChangePassword: boolean('must_change_password').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  passwordChangedAt: timestamp('password_changed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type TenantAccount = typeof tenantAccounts.$inferSelect;
export type NewTenantAccount = typeof tenantAccounts.$inferInsert;
