import { pgTable, uuid, varchar, text, date, numeric, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { employees } from './employees';
import { companies } from './companies';

export const employmentHistory = pgTable('employment_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
  companyEmployeeCode: varchar('company_employee_code', { length: 100 }),
  designation: varchar('designation', { length: 150 }),
  department: varchar('department', { length: 150 }),
  workLocation: varchar('work_location', { length: 255 }),
  joiningDate: date('joining_date').notNull(),
  exitDate: date('exit_date'),
  salary: numeric('salary', { precision: 10, scale: 2 }),
  salaryBreakdown: text('salary_breakdown'),
  status: varchar('status', { length: 30 }).notNull().default('onboarding'),
  exitReason: varchar('exit_reason', { length: 50 }),
  exitRemarks: text('exit_remarks'),
  interviewId: uuid('interview_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
