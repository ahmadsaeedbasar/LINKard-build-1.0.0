# LINKard Documentation

## Overview

LINKard is a professional platform connecting influencers with clients for collaboration opportunities.

## Project Structure

```
linkard-monorepo/
├── frontend/           # React/Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── packages/          # Shared packages
│   └── types/         # Shared TypeScript types
├── supabase/          # Database migrations and config
│   └── migrations/    # SQL migration files
├── backend/           # Backend API (if needed)
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
└── package.json       # Monorepo configuration
```

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Authentication**: Supabase Auth

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase client-side SDK (no custom backend needed)

### Database Schema
- `user_management.profiles`: User profiles for influencers and clients
- `interaction_management.inquiries`: Communication between clients and influencers

## Development

### Prerequisites
- Node.js 18+
- pnpm
- Supabase account

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_ACCESS_TOKEN=your-access-token
```

## Deployment

The application is configured for deployment to Cloudflare Pages:

```bash
pnpm deploy
```

## Database

### Local Development
```bash
# Start local Supabase
pnpm supabase:start

# Reset database
pnpm supabase:reset

# Open Supabase Studio
pnpm supabase:studio
```

### Production
The database schema is managed through migrations in `supabase/migrations/`.

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]