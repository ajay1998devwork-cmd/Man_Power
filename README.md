# Super Admin Platform

Complete Super Admin authentication and tenant management system for the Manpower SaaS platform.

## Overview

This is a **completely separate application** from the main manpower-platform. It is used exclusively by the SaaS platform owner/administrator to manage manpower consultancy tenants.

## Features Implemented

### ✅ Authentication & Security
- Secure Super Admin login with Argon2id password hashing
- HttpOnly session cookies
- Rate limiting on login endpoint
- Protected routes with authentication guards
- Secure logout with session invalidation

### ✅ Tenant Management
- Create manpower agencies with complete information
- Auto-generate unique usernames and secure temporary passwords
- View all agencies with pagination and search
- View detailed agency information
- Manage agency status (Active/Suspended/Inactive)
- Upload and manage agency documents

### ✅ Dashboard
- Overview statistics (Total, Active, Suspended, Inactive agencies)
- Quick actions for common tasks

### ✅ Audit Logging
- Track all Super Admin actions
- Record tenant creation, status changes, document uploads

## Architecture

```
Frontend (React + Vite)
    ↓
Backend API (NestJS)
    ↓
PostgreSQL Database
    ↓
Drizzle ORM
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- React Hook Form (form management)
- Zod (validation)
- Tailwind CSS (styling)

### Backend
- NestJS
- TypeScript
- Express Session
- Argon2id (password hashing)
- Rate limiting

### Database
- PostgreSQL
- Drizzle ORM
- Drizzle Kit (migrations)

## Project Structure

```
super-admin-platform/
├── api/                          # Backend API
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/       # Custom decorators
│   │   │   ├── guards/           # Auth guards
│   │   │   └── utils/            # Utilities
│   │   ├── database/
│   │   │   ├── schema/           # Database schema
│   │   │   ├── db.ts             # Database connection
│   │   │   ├── migrate.ts        # Migration runner
│   │   │   └── seed.ts           # Database seeder
│   │   ├── modules/
│   │   │   ├── auth/             # Authentication
│   │   │   ├── tenants/          # Tenant management
│   │   │   ├── audit/            # Audit logging
│   │   │   └── storage/          # File storage
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
│
└── src/                          # Frontend
    ├── components/
    │   ├── layout/               # Layout components
    │   └── ui/                   # Reusable UI components
    ├── lib/
    │   ├── api/                  # API client functions
    │   ├── api-client.ts         # Base API client
    │   ├── auth.tsx              # Auth context
    │   └── types.ts              # TypeScript types
    ├── routes/                   # File-based routes
    │   ├── _authenticated/       # Protected routes
    │   │   ├── dashboard.tsx
    │   │   └── tenants/
    │   ├── login.tsx
    │   └── index.tsx
    └── main.tsx
```

## Database Schema

### Tables Created

1. **super_admin_users** - Super Admin accounts
2. **tenants** - Manpower agencies
3. **tenant_accounts** - Tenant login credentials (1:1 with tenants)
4. **tenant_documents** - Agency documents
5. **audit_logs** - System audit trail

## Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb super_admin_platform
```

### 2. Backend Setup

```bash
cd api

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgresql://postgres:password@localhost:5432/super_admin_platform
# SUPER_ADMIN_EMAIL=admin@example.com
# SUPER_ADMIN_PASSWORD=YourSecurePassword123!
# SESSION_SECRET=your-secure-random-secret
# FRONTEND_URL=http://localhost:5174

# Generate database migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed Super Admin user
pnpm db:seed

# Start development server
pnpm start:dev
```

The API will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# From project root
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:3001

# Start development server
pnpm dev
```

The frontend will run on `http://localhost:5174`

## Usage

### Initial Login

1. Navigate to `http://localhost:5174`
2. Login with the credentials from your `.env` file:
   - Email: `admin@example.com` (or your configured email)
   - Password: Your configured password

### Creating an Agency

1. Click "Create Agency" from dashboard or agencies page
2. Fill in agency information:
   - Agency name
   - Contact person details
   - Address information
3. Submit the form
4. **IMPORTANT**: Save the generated credentials shown on success page
   - Username (auto-generated from agency name)
   - Temporary password (shown only once)
5. The tenant must change password on first login

### Managing Agencies

- **View All**: Navigate to Agencies page
- **Search**: Use search box to filter by name, contact, email, or mobile
- **View Details**: Click "View" on any agency
- **Change Status**: Use Activate/Suspend/Deactivate buttons
- **Upload Documents**: Select document type and upload PDF/images

## API Endpoints

### Authentication
- `POST /auth/login` - Super Admin login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Tenants
- `GET /tenants` - List all tenants (paginated)
- `POST /tenants` - Create new tenant
- `GET /tenants/:id` - Get tenant details
- `PATCH /tenants/:id/status` - Update tenant status
- `POST /tenants/:id/documents` - Upload document
- `GET /tenants/dashboard-stats` - Get dashboard statistics

## Security Features

### Implemented
- ✅ Argon2id password hashing
- ✅ HttpOnly secure cookies
- ✅ CORS with credentials
- ✅ Rate limiting (10 requests/minute on login)
- ✅ Input validation (Zod + class-validator)
- ✅ SQL injection protection (Drizzle ORM)
- ✅ Generic error messages (no information leakage)
- ✅ File upload validation (type, size)
- ✅ Session-based authentication
- ✅ Protected routes
- ✅ Audit logging

### Environment Variables
Never commit `.env` files. Always use `.env.example` as template.

## Development Commands

### Frontend
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

### Backend
```bash
pnpm start:dev    # Start with watch mode
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema (dev only)
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed Super Admin
```

## Production Deployment

### Environment Variables (Production)

```bash
# Backend
NODE_ENV=production
DATABASE_URL=<production-database-url>
SESSION_SECRET=<strong-random-secret>
FRONTEND_URL=<production-frontend-url>
SUPER_ADMIN_EMAIL=<admin-email>
SUPER_ADMIN_PASSWORD=<strong-password>

# Frontend
VITE_API_URL=<production-api-url>
```

### Build Steps

```bash
# Backend
cd api
pnpm install
pnpm build
pnpm db:migrate
pnpm db:seed

# Frontend
pnpm install
pnpm build
```

## Future Enhancements

- Multi-user support for Super Admin
- Advanced analytics and reporting
- Subscription plan management
- Billing integration
- Email notifications
- Activity logs viewer
- Export functionality
- Advanced search filters

## Important Notes

- **NO DOCKER** - Local development uses Node.js + pnpm + PostgreSQL directly
- **One tenant = One account** - Current design supports one login per agency
- **Password security** - Temporary passwords shown only once after creation
- **Document storage** - Currently uses local filesystem with abstraction for future S3 integration
- **Audit logs** - All critical actions are logged (no sensitive data)

## Troubleshooting

### Cannot connect to database
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

### CORS errors
- Check FRONTEND_URL in backend `.env`
- Ensure credentials are included in requests

### Session not persisting
- Check SESSION_SECRET is set
- Verify cookies are enabled in browser
- Check secure flag matches environment (http vs https)

### TypeScript errors
- Run `pnpm install` in both root and api directories
- Restart TypeScript server in IDE

## License

Private - Internal use only
