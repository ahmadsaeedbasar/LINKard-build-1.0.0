# Backend

## Overview

LINKard uses **Supabase-only architecture** - no custom backend server is required. All backend functionality is handled by Supabase services:

### Supabase Services Used:
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: User management and auth flows
- **Storage**: File uploads (if needed)
- **Edge Functions**: Serverless functions (if needed)

### Why No Custom Backend?
- Supabase provides all necessary backend services
- Reduces complexity and maintenance overhead
- Built-in security features (RLS, auth)
- Scalable and cost-effective

### Database Schema
- `user_management.profiles`: User profiles
- `interaction_management.inquiries`: Client-influencer communications

### API Access
The frontend communicates directly with Supabase using the client SDK. All data operations are secured through:
- Row Level Security policies
- Authentication tokens
- Database constraints

### Future Backend Needs
If custom business logic is required, consider:
- Supabase Edge Functions for serverless compute
- Custom API routes in the frontend deployment
- Separate backend service if complexity grows

## Configuration

Backend configuration is handled through environment variables in the root `.env` file.