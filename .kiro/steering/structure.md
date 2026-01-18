# Project Structure & Organization

## Root Level Files

- `App.tsx`: Main application component with routing logic
- `index.tsx`: Application entry point
- `types.ts`: Global TypeScript type definitions (Severity, ScanStatus, Finding, ScanResult, User, AuthState)
- `infrastructure.ts`: Infrastructure/deployment configuration
- `metadata.json`: Application metadata and permissions

## Directory Structure

### `/components`
React UI components following single responsibility principle:
- `Dashboard.tsx`: Main dashboard view
- `Scanner.tsx`: Code scanning interface with GitHub and file upload modes
- `Report.tsx`: Scan results display
- `History.tsx`: Scan history management
- `BAAGenerator.tsx`: Business Associate Agreement generator
- `Login.tsx`: Authentication interface
- Layout components: `Header.tsx`, `Footer.tsx`, `Sidebar.tsx`
- Security components: `SecurityBadge.tsx`, `SecurityGuarantee.tsx`
- Utility components: `ExportModal.tsx`, `PrivacyPolicy.tsx`

### `/services`
Business logic and external integrations:
- `AuthContext.tsx`: Authentication state management
- `scanService.ts`: Core scanning orchestration (GitHub and file upload)
- `bedrockService.ts`: AWS Bedrock AI integration
- `geminiService.ts`: Google Gemini AI integration
- `claudeService.ts`: Claude AI integration
- `supabase.ts`: Database client configuration
- `baaService.ts`: BAA document generation
- `reportExportService.ts`: Report export functionality
- `securityService.ts`: Security utilities
- `regulationUpdateService.ts`: HIPAA regulation updates

### `/api`
Server-side API endpoints:
- `analyze.ts`: Secure code analysis endpoint using AWS Bedrock

### `/config`
Configuration files:
- `hipaa-regulations.json`: HIPAA compliance rules and penalty tiers

## Naming Conventions

- **Components**: PascalCase (e.g., `BAAGenerator.tsx`)
- **Services**: camelCase with descriptive suffixes (e.g., `scanService.ts`)
- **Types**: PascalCase enums and interfaces in `types.ts`
- **Files**: kebab-case for config, camelCase for code

## Import Patterns

- Use `@/*` path aliases for clean imports
- Services imported from `./services/`
- Components imported from `./components/`
- Types imported from `./types`

## State Management

- Authentication: React Context (`AuthContext.tsx`)
- UI State: Local component state with hooks
- Persistence: Supabase + localStorage fallback pattern
- Navigation: Simple string-based routing in `App.tsx`

## Security Architecture

- Sensitive operations routed through `/api` endpoints
- Client-side API keys only for safe services (Gemini)
- AWS credentials handled server-side only
- Supabase RLS policies for data isolation
- Code analysis performed server-side via Bedrock API

## Local Storage Keys

- `guardphi_scans`: Scan history cache
- `guardphi_ai_provider`: Selected AI provider preference
