# AI Coding Agent Instructions: TikTok UGC Generator

## Project Overview

**TikTok UGC Generator** is a Next.js web platform that enables marketing agencies to generate authentic user-generated content (UGC) videos at scale. It integrates multiple external APIs (HeyGen/D-ID for avatars, ElevenLabs/PlayHT for voice, OpenAI for scripts) to create Reels/TikTok videos with AI avatars, voice synthesis, and auto-captions in minutes instead of weeks.

**Tech Stack**: Next.js 16, TypeScript, React 19, Zustand (state), TanStack Query (server state), Supabase (auth), shadcn/ui + Tailwind CSS, Zod (validation)

---

## Architecture & Data Flows

### Core Domains
- **Scripts**: AI-generated or user-written TikTok scripts with hooks, tone, duration
- **Avatars**: Managed library of AI avatars (provider: HeyGen or D-ID) with metadata
- **Videos**: Generated video outputs from script + avatar + voice combinations
- **Projects**: Campaign containers grouping scripts/videos with brand guidelines
- **Users**: Team members with roles (admin/member/viewer) for collaboration

### API Integration Pattern
External services are wrapped in `src/app/api/{domain}/` routes:
- `api/scripts/` - OpenAI integration for script generation
- `api/videos/` - HeyGen/D-ID video rendering pipeline
- `api/auth/` - Supabase authentication flows

**Convention**: Keep provider-specific logic isolated; use environment variables to swap implementations (e.g., HeyGen vs D-ID).

### State Management
- **Auth**: `use-auth-store` - persisted user session via Zustand + localStorage
- **Projects**: `use-project-store` - current project context
- **Videos**: `use-video-store` - video generation status/history
- **Server State**: React Query for API calls (hooks in components consume stores + queries)

**Key Pattern**: Stores hold UI state + session; queries fetch/mutate server data. Always use `useQuery`/`useMutation` for API calls.

### UI Layout Structure
```
(auth): Login/signup pages (public routes)
(dashboard): Authenticated pages with sidebar navigation
  ├─ dashboard: Overview/home
  ├─ projects: Project list + creation
  ├─ projects/[id]: Project detail editor
  ├─ videos: Video gallery/history
  ├─ videos/new: Video generation form
  └─ settings: User/workspace settings
```

---

## Development Workflows

### Setup & Execution
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check (no auto-fix configured)
```

### Environment Requirements
Create `.env.local` with required services:
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- OpenAI: `OPENAI_API_KEY`
- Avatar provider: `HEYGEN_API_KEY` (preferred) OR `DID_API_KEY`
- Voice provider: `ELEVENLABS_API_KEY` (preferred) OR `PLAYHT_API_KEY` + `PLAYHT_USER_ID`

See [src/lib/config.ts](src/lib/config.ts) for validation logic and optional/required keys.

### Adding Features
1. **New entity type**: Add type in [src/types/index.ts](src/types/index.ts)
2. **API endpoint**: Create route in `src/app/api/{domain}/route.ts`
3. **State sync**: Add to appropriate Zustand store or React Query
4. **UI component**: Place in `src/components/{domain}/` using shadcn/ui components
5. **Page route**: Add to `src/app/(dashboard)/{route}/page.tsx`

---

## Project-Specific Patterns & Conventions

### Styling & Component Library
- **UI Components**: Use shadcn/ui (Radix UI primitives + Tailwind)
  - Located: `src/components/ui/`
  - Usage: Import and compose (e.g., `<Button>`, `<Card>`, `<Dialog>`)
- **Tailwind**: v4 with CSS variables; classes via `cn()` utility
- **Icons**: lucide-react
- **Theme**: Dark mode support via `next-themes`
- **Toast**: `sonner` for notifications

### Form Handling
- **React Hook Form** + **Zod** validation (already imported in packages)
- Pattern: Define Zod schema, pass to `useForm`, use `<form>` with controlled inputs
- Example: Tone selection uses `<Select>` component for predefined options

### Type Safety
- Strict TypeScript enabled; all API responses must match [src/types/index.ts](src/types/index.ts)
- Zod schemas for runtime validation of external API responses
- Path aliases: `@/*` → `src/` (configured in tsconfig.json)

### Naming Conventions
- Components: PascalCase, colocated with domain (e.g., `ScriptEditor.tsx` in `src/components/scripts/`)
- Stores: `use{Domain}Store.ts` pattern
- API routes: RESTful structure (`/api/{resource}/{action}`)
- Enum-like types: Literal unions (e.g., `HookType = 'pov' | 'wait_for_it' | ...`)

### Error Handling & Logging
- API routes: Use Zod for input validation; throw descriptive errors
- Client: Toast errors via `sonner` for UX feedback
- Provider failures: Gracefully fall back (e.g., HeyGen unavailable → try D-ID)

---

## Critical Integration Points

### Video Generation Pipeline
1. User submits form: script + avatar + voice selections
2. `POST /api/videos/generate` orchestrates provider calls
3. Script → OpenAI (if AI-generated)
4. Avatar lookup + HeyGen API call for video render
5. Voice synthesis via ElevenLabs/PlayHT
6. Store result in Supabase, update video store
7. Client polls or receives webhook for completion

### Authentication Flow
- Supabase email/password via `api/auth/login`, `api/auth/signup`
- Session persisted in `use-auth-store`
- Protected routes check `isAuthenticated` flag

### Workspace/Project Context
- Projects scoped by `workspaceId` (implicit per user session)
- When creating videos/scripts, always associate with active `projectId` from store

---

## Common Tasks

### Adding a New Hook Type
1. Update [src/types/index.ts](src/types/index.ts): `export type HookType = '...' | 'new_hook'`
2. Add to OpenAI prompt in `api/scripts/`
3. Update `<Select>` options in UI form

### Adjusting Avatar/Voice Selection UI
- Modify `src/components/videos/new/page.tsx` or dedicated component
- Fetch avatars from store; display as list/grid using shadcn `<Card>`

### Handling API Rate Limits
- Add retry logic with exponential backoff in API routes
- Consider queue system (later enhancement) if volumes scale

---

## Notes for Agents

- **Testing**: No test suite currently; manual testing via dev server
- **Database**: Supabase tables structure inferred from types; ensure migrations match types
- **Performance**: Next.js 16 auto-optimizations; use React Query for caching
- **Deployment**: Ready for Vercel; ensure all env vars set in production
- **Incomplete Features**: Database schema, video webhook polling, full error boundaries not yet implemented—treat as scaffolding to complete

