import { pgTable, uuid, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { candidates } from './candidates';
import { companies } from './companies';

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  candidateId: uuid('candidate_id').references(() => candidates.id).notNull(),
  agencyEmployeeCode: varchar('agency_employee_code', { length: 50 }).notNull(),
  currentCompanyId: uuid('current_company_id').references(() => companies.id),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  firstJoiningDate: date('first_joining_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
