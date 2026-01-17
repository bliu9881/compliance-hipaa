# Technology Stack & Build System

## Core Technologies

- **Frontend Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0 with React plugin
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Icons**: Lucide React for consistent iconography
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Services**:
  - AWS Bedrock (Claude 3.5 Sonnet) - Server-side, default provider
  - Google Gemini 3 - Client-side provider
  - Configurable per user via Sidebar settings (authenticated users only)
  - Preferences stored in Supabase with localStorage fallback

## Development Environment

- **Node.js**: Required for development
- **Package Manager**: npm
- **TypeScript**: ~5.8.2 with strict configuration
- **Module System**: ESNext with bundler resolution

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Required environment variables in `.env.local`:
- `GEMINI_API_KEY`: Google Gemini API key (exposed to client)
- AWS credentials handled server-side for security

## Architecture Patterns

- **Service Layer**: All business logic in `/services` directory
- **Component-Based**: React functional components with hooks
- **Type Safety**: Comprehensive TypeScript types in `types.ts`
- **State Management**: React Context for authentication, local state for UI
- **API Integration**: Secure server-side API endpoints for sensitive operations
- **Fallback Strategy**: Local storage fallback for offline functionality

## Code Quality

- Strict TypeScript configuration with experimental decorators
- Path aliases using `@/*` for clean imports
- ESLint and type checking via IDE integration
