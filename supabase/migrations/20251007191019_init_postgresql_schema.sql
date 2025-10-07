/*
  # Initial PostgreSQL Schema for Application Vacances Longueuil

  1. New Tables
    - `Employee` - Employee information with team and seniority
    - `Week` - Calendar weeks for 2025
    - `Entitlement` - Vacation and time-off balances per employee per year
    - `TimeOffRequest` - Time-off requests with status tracking
    - `RequestWeek` - Junction table linking requests to specific weeks
    - `Settings` - Annual configuration (blackout weeks, minimum staff)
    - `Round` - Request submission rounds with time windows
    - `RoundSlot` - Employee priority slots within each round
    - `Holiday` - Statutory holidays
    - `AuditLog` - Audit trail for all changes

  2. Enums
    - `EmployeeStatus` - active, inactive
    - `TimeOffType` - VAC, TA, PER, CM, OTHER
    - `PartialDay` - AM, PM, FULL
    - `RequestStatus` - draft, submitted, approved, rejected, locked

  3. Security
    - RLS will be added in subsequent migrations
    - All tables have created_at and updated_at timestamps
*/

-- Create enums
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive');
CREATE TYPE "TimeOffType" AS ENUM ('VAC', 'TA', 'PER', 'CM', 'OTHER');
CREATE TYPE "PartialDay" AS ENUM ('AM', 'PM', 'FULL');
CREATE TYPE "RequestStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'locked');

-- Employee table
CREATE TABLE IF NOT EXISTS "Employee" (
  id TEXT PRIMARY KEY,
  upn TEXT UNIQUE,
  full_name TEXT NOT NULL,
  title TEXT,
  team TEXT NOT NULL,
  division TEXT,
  seniority_date TIMESTAMP(3) NOT NULL,
  status "EmployeeStatus" NOT NULL DEFAULT 'active',
  manager_upn TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Week table
CREATE TABLE IF NOT EXISTS "Week" (
  id TEXT PRIMARY KEY,
  monday_date TIMESTAMP(3) NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  week_number_iso INTEGER NOT NULL,
  is_holiday_week BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Entitlement table
CREATE TABLE IF NOT EXISTS "Entitlement" (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL REFERENCES "Employee"(id),
  year INTEGER NOT NULL,
  vacation_days_total DECIMAL(4, 1) NOT NULL,
  vacation_days_remaining DECIMAL(4, 1) NOT NULL,
  ta_hours_total DECIMAL(5, 1) NOT NULL,
  ta_hours_remaining DECIMAL(5, 1) NOT NULL,
  personal_days_remaining DECIMAL(4, 1) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("employeeId", year)
);

-- TimeOffRequest table
CREATE TABLE IF NOT EXISTS "TimeOffRequest" (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL REFERENCES "Employee"(id),
  type "TimeOffType" NOT NULL,
  start_date TIMESTAMP(3) NOT NULL,
  end_date TIMESTAMP(3) NOT NULL,
  partial_day "PartialDay",
  status "RequestStatus" NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP(3),
  approved_by_upn TEXT,
  "roundId" TEXT,
  comment TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "TimeOffRequest_employeeId_start_date_end_date_idx" 
  ON "TimeOffRequest"("employeeId", start_date, end_date);

-- RequestWeek table
CREATE TABLE IF NOT EXISTS "RequestWeek" (
  id TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL REFERENCES "TimeOffRequest"(id),
  "weekId" TEXT NOT NULL REFERENCES "Week"(id),
  days_in_week DECIMAL(3, 1) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("requestId", "weekId")
);

-- Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL UNIQUE,
  rounds_count INTEGER NOT NULL,
  max_weeks_per_round INTEGER NOT NULL,
  min_staff_by_team_and_week JSONB NOT NULL,
  blackout_weeks JSONB NOT NULL,
  priority_logic TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Round table
CREATE TABLE IF NOT EXISTS "Round" (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  opens_at TIMESTAMP(3) NOT NULL,
  closes_at TIMESTAMP(3) NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  allowed_weeks_this_round INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (year, round_number)
);

-- Add foreign key for TimeOffRequest.roundId
ALTER TABLE "TimeOffRequest" 
  ADD CONSTRAINT "TimeOffRequest_roundId_fkey" 
  FOREIGN KEY ("roundId") REFERENCES "Round"(id);

-- RoundSlot table
CREATE TABLE IF NOT EXISTS "RoundSlot" (
  id TEXT PRIMARY KEY,
  "roundId" TEXT NOT NULL REFERENCES "Round"(id),
  "employeeId" TEXT NOT NULL REFERENCES "Employee"(id),
  slot_order INTEGER NOT NULL,
  acted_at TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("roundId", slot_order)
);

-- Holiday table
CREATE TABLE IF NOT EXISTS "Holiday" (
  id TEXT PRIMARY KEY,
  date TIMESTAMP(3) NOT NULL UNIQUE,
  label TEXT NOT NULL,
  applies_to TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY,
  actor_upn TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_json JSONB,
  after_json JSONB,
  happened_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorEmployeeId" TEXT REFERENCES "Employee"(id),
  "requestId" TEXT REFERENCES "TimeOffRequest"(id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_employee_updated_at BEFORE UPDATE ON "Employee"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_week_updated_at BEFORE UPDATE ON "Week"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entitlement_updated_at BEFORE UPDATE ON "Entitlement"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeoffrequest_updated_at BEFORE UPDATE ON "TimeOffRequest"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requestweek_updated_at BEFORE UPDATE ON "RequestWeek"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON "Settings"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_round_updated_at BEFORE UPDATE ON "Round"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roundslot_updated_at BEFORE UPDATE ON "RoundSlot"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holiday_updated_at BEFORE UPDATE ON "Holiday"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();