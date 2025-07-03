# Supabase Schema & Migration Guide for Rarity Leads

This guide explains how to set up, migrate, and manage the Supabase database schema for the Rarity Leads SaaS platform.

## Directory Structure

- `/supabase/schema/001_create_tables.sql` — Create all tables
- `/supabase/schema/002_enable_rls.sql` — Enable Row Level Security (RLS)
- `/supabase/schema/003_create_policies.sql` — Create RLS policies
- `/supabase/seed/seed_data.sql` — Seed data for local/staging

## Step-by-Step Setup

### 1. Create Tables
- Open Supabase SQL Editor or use Supabase CLI.
- Run: `001_create_tables.sql`

### 2. Enable RLS
- Run: `002_enable_rls.sql`

### 3. Create Policies
- Run: `003_create_policies.sql`

### 4. Seed Data (Optional)
- Run: `seed_data.sql` for test data

## How to Run Files

### Using Supabase SQL Editor
1. Open your project in Supabase.
2. Go to Database > SQL Editor.
3. Paste the contents of each file in order and run.

### Using Supabase CLI
1. Place files in your repo as shown above.
2. Run migrations with the CLI: `supabase db push`

## How to Validate RLS
- Try to select/insert as a regular user: you should only see your own data.
- Try as an admin (role = 'admin'): you should see all data.
- Use the Supabase dashboard to test policies interactively.

## How to Rollback or Update Schema Safely
- Use versioned migration files (001, 002, 003, ...)
- To rollback, create a new migration that reverses the previous changes.
- Always backup your data before running destructive migrations.

## Notes
- All user-specific tables use UUID PKs and reference `auth.users`.
- All RLS policies are based on `auth.uid()` for users and allow full access for admins.
- Indexes are added for performance on foreign keys and frequently queried fields.

---

**For any schema changes, always add a new migration file and update this README.** 