# Supabase Setup for LINKard

This directory contains the Supabase configuration and migrations for the LINKard project.

## Directory Structure

```
supabase/
├── config.toml          # Supabase configuration
├── migrations/          # Database migrations
│   └── 20240112000000_initial_schema.sql
├── seed.sql            # Seed data
└── README.md           # This file
```

## Local Development Setup

### Prerequisites

- Install Supabase CLI: `npm install -g supabase`
- Docker Desktop running

### Initialize Local Supabase

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# View local studio
supabase studio
```

### Database Schema

The database is organized into logical schemas:

- **user_management**: User profiles and authentication data
- **content_management**: Portfolio items and media content
- **interaction_management**: Inquiries and user communications
- **analytics_management**: Event tracking and analytics
- **system_management**: Application settings

### Tables

- `user_management.profiles`: User profile information
- `content_management.portfolio_items`: Portfolio media items
- `interaction_management.inquiries`: User inquiries between clients and influencers
- `analytics_management.analytics_events`: Analytics tracking events
- `system_management.system_settings`: Application configuration

### Security

All tables use Row Level Security (RLS) with appropriate policies for data access control.

## Production Deployment

### Connect to Remote Supabase

```bash
# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to production
supabase db push
```

### Environment Variables

Set these in your production environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Workflow

1. Make schema changes in migration files
2. Test locally: `supabase db reset`
3. Push to production: `supabase db push`
4. Generate types: `supabase gen types typescript --local > src/types/supabase.ts`

## Useful Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database
supabase db reset

# View logs
supabase logs

# Open Studio
supabase studio