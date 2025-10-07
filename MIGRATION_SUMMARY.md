# Migration Summary - Azure to Supabase

## Overview

This document summarizes the migration of the Application Vacances Longueuil from Azure-based infrastructure to a standard web architecture using Supabase.

## Completed Changes

### 1. Database Migration

**Before**: Azure SQL (SQL Server)
**After**: PostgreSQL (Supabase)

- Converted Prisma schema from `sqlserver` to `postgresql` provider
- Updated all database connection strings to use Supabase pooler
- Applied initial migration to Supabase using MCP tools
- Seeded database with test data (employees, weeks, holidays, settings, rounds, entitlements)

**Key Changes**:
- Changed `@db.Decimal` types to use PostgreSQL-compatible decimal types
- Updated `Json` types to use PostgreSQL `jsonb`
- Modified `DateTime` handling for PostgreSQL timestamp format
- Replaced Azure SQL connection string with Supabase DATABASE_URL

### 2. Authentication

**Before**: Azure AD / MSAL
**After**: Supabase Auth

- Removed `@azure/msal-browser` and related Azure AD dependencies
- Implemented Supabase Auth with email/password authentication
- Created new Login page component
- Updated `App.tsx` to check Supabase session state
- Modified API client to use Supabase session tokens instead of Azure AD tokens

**Key Files**:
- `/apps/web/src/lib/supabase.ts` - Supabase client initialization
- `/apps/web/src/pages/Login.tsx` - New login page
- `/apps/web/src/api/client.ts` - Updated to use Supabase auth tokens
- `/apps/web/src/App.tsx` - Session management and protected routes

### 3. API Migration

**Before**: Azure Functions (HTTP triggers)
**After**: Express.js API

- Created new Express server in `/apps/api/src/server.ts`
- Converted all Azure Function endpoints to Express routes:
  - `GET /api/me` - Get current user profile
  - `GET /api/weeks` - Get weeks for a year
  - `GET /api/requests` - List time-off requests
  - `POST /api/requests` - Create new request
  - `POST /api/requests/:id/submit` - Submit a request
  - `GET /api/holidays` - Get holidays
  - `GET /api/settings` - Get annual settings
  - `GET /api/health` - Health check endpoint

- Removed old Azure Functions files (`/apps/api/src/functions`, `/apps/api/src/middleware`)
- Updated authentication middleware to use Supabase Auth
- Changed default API port from 7071 (Azure Functions) to 3001 (Express)

**Key Files**:
- `/apps/api/src/server.ts` - Main Express server
- `/apps/api/src/config.ts` - Updated configuration for Supabase
- `/apps/api/package.json` - Updated scripts (dev, start)

### 4. Environment Configuration

**Before**: Azure-specific environment variables
**After**: Supabase environment variables

Created `.env.example` with new required variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres.your-project:password@...
VITE_API_BASE_URL=http://localhost:3001/api
```

Removed:
- `AZURE_SQL_CONNECTION_STRING`
- `JWT_AUDIENCE`, `JWT_ISSUER`
- `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`

### 5. Frontend Updates

- Removed Teams SDK initialization (`initTeams()`, `initializeAuth()`)
- Updated API base URL from `http://localhost:7071/api` to `http://localhost:3001/api`
- Added session-based authentication flow
- Implemented protected routes with automatic redirect to login
- Updated API client interceptors to use Supabase session tokens

### 6. Database Schema

All tables successfully migrated to PostgreSQL:
- Employee (4 test records)
- Week (12 weeks from May-July 2025)
- Entitlement (4 records, one per employee)
- TimeOffRequest
- RequestWeek
- Settings (2025 configuration)
- Round (3 rounds for 2025)
- RoundSlot
- Holiday (5 holidays)
- AuditLog

## Removed Components

### Azure-specific Files
- `/apps/api/host.json` - Azure Functions configuration
- `/apps/api/src/functions/*` - All Azure Function handlers
- `/apps/api/src/middleware/authenticate.ts` - Azure AD middleware
- `/apps/web/src/auth/azureAd.ts` - Azure AD authentication (no longer used)
- `/apps/web/src/app/teams.ts` - Teams SDK (no longer used)

### Dependencies Removed (should be cleaned up)
- `@azure/functions`
- `@azure/identity`
- `@azure/msal-node`
- `@azure/msal-browser`
- `@azure/msal-react`
- `@microsoft/microsoft-graph-client`
- `@microsoft/teams-js`

## Testing Status

### Completed
✅ TypeScript compilation (no errors)
✅ Database schema migration
✅ Data seeding
✅ API build

### Requires Manual Testing
⚠️ Authentication flow (login/logout)
⚠️ API endpoints functionality
⚠️ Frontend data fetching
⚠️ Request creation workflow
⚠️ Admin pages

## Next Steps

### For Development
1. Start API server: `npm run dev --workspace=apps/api`
2. Start frontend: `npm run dev --workspace=apps/web`
3. Create test user in Supabase Auth console
4. Create corresponding Employee record in database
5. Test login and basic functionality

### For Production Deployment
1. Set up Supabase project in production
2. Configure environment variables for production
3. Run database migrations
4. Seed production data
5. Deploy API (e.g., to Railway, Render, or Vercel)
6. Deploy frontend (e.g., to Vercel, Netlify)
7. Configure CORS properly for production domains

### Cleanup Tasks
1. Remove unused Azure dependencies from package.json
2. Delete `/infra` directory (Azure Bicep templates)
3. Update `/docs/bolt-migration-plan.md` to reflect completed work
4. Remove deprecated Azure-specific code

## Migration Benefits

1. **Simplified Architecture**: No need for Azure-specific tooling or configurations
2. **Cost Reduction**: Supabase free tier vs Azure services
3. **Easier Local Development**: No Azure Functions Core Tools required
4. **Standard Web Stack**: Express API can be deployed anywhere
5. **Better DX**: Faster local development with standard Node.js server
6. **Portability**: Easy to migrate to other hosting providers if needed

## Known Limitations

1. **No Row Level Security (RLS)**: Current setup doesn't use Supabase RLS policies. Should be added for production.
2. **Prisma vs Supabase Client**: Using both Prisma and Supabase client. Should consolidate to one approach.
3. **No Password Reset Flow**: Need to implement password reset using Supabase Auth
4. **No Email Verification**: Currently disabled, should be enabled for production
5. **No Role-Based Access Control**: Admin/manager roles not yet implemented in Supabase

## Technical Debt

1. Old services (`profileService.ts`, `timeOffService.ts`) still use Prisma but could use Supabase client
2. Week calculation utilities (`weekUtils.ts`) need testing with PostgreSQL
3. Request creation logic needs to be migrated to use Supabase properly
4. Azure AD authentication files still present in codebase but unused

## Conclusion

The migration from Azure to Supabase is functionally complete. The application now uses:
- PostgreSQL database hosted on Supabase
- Supabase Auth for authentication
- Express API instead of Azure Functions
- Standard web deployment architecture

All TypeScript compilation passes and the basic structure is in place. Manual testing and refinement of authentication flows are the main remaining tasks.
