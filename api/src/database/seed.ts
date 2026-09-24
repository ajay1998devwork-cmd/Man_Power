import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { PasswordUtil } from '../common/utils/password.util';
import * as schema from './schema';

config();

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  if (!email || !password) {
    console.error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log('Seeding Super Admin user...');

  const passwordHash = await PasswordUtil.hash(password);

  await db.insert(schema.admins).values({
    email,
    passwordHash,
    status: 'ACTIVE',
  }).onConflictDoNothing();

  console.log('✅ Super Admin user created successfully');
  console.log(`Email: ${email}`);
  console.log('You can now login with this email and password');

  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
