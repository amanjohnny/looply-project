# Project Review: looply-project

## Quick snapshot
- Repo currently contains a single implemented app: **`frontend/`** (React + TypeScript + Vite).
- Root `README.md` is minimal, while most implementation context is inside source code.
- State management is centralized in a single Zustand store (`useAppStore`) with rich mock data and actions.

## Tech stack
- **Framework/build:** React 18, TypeScript, Vite.
- **Styling/UX:** Tailwind CSS, Framer Motion, Lucide icons.
- **State:** Zustand (single global store).
- **Other libs included:** Three.js, GSAP, Matter.js/Cannon-es, i18n packages (not all heavily used in core app shell).

## Product structure inferred from code
The app behaves like a social productivity/student challenge platform with:
- Authentication and onboarding flow (splash → pository selection → AKBNIS auth).
- Feed and stories.
- Missions/challenges and challenge request workflow.
- Social layer: comments, groups, direct threads.
- Profile editing/settings and collectible/reward mechanics.

## App flow architecture
- `App.tsx` controls top-level routing-like behavior using app state rather than `react-router` routes.
- Unauthenticated flow is staged with animated transitions (`EntryStage`).
- Authenticated flow switches pages by `currentPage` and conditionally renders a bottom nav.
- Global Escape-key behavior handles back navigation and closes overlays/chats/story viewer.

## Data model and state design
- `types/index.ts` defines core domain entities (`User`, `Challenge`, `Group`, `Story`, `DirectThread`, etc.).
- `useAppStore.ts` includes:
  - App-wide UI/navigation state.
  - Large seeded mock datasets.
  - Business actions for posts, comments, messaging, challenge requests, group admin behaviors, stories, and profile preferences.

## Strengths
- Strongly typed domain model with practical unions for workflow states.
- Feature breadth is high for a front-end prototype.
- UX polish in transitions/navigation and story overlay handling.

## Risks / opportunities
1. **Monolithic store complexity**
   - `useAppStore.ts` is very large and mixes data seeding, domain logic, and UI concerns.
   - Likely to become hard to maintain and test.
2. **No explicit backend integration layer**
   - Current behavior appears mock-data driven.
   - Next step is introducing API adapters and persistence boundaries.
3. **Routing strategy**
   - `currentPage` switch works for prototypes but may limit deep links/browser navigation.
   - Consider moving to route-based navigation for scale.
4. **Docs gap**
   - Root docs do not describe setup, architecture, or feature map.

## Suggested next steps (pragmatic)
1. Split Zustand store into slices (`auth`, `feed`, `groups`, `missions`, `ui`) and isolate mock seed data.
2. Add an API service layer with typed DTOs and repository-style wrappers.
3. Introduce route-level navigation for primary pages while keeping store for ephemeral UI state.
4. Expand top-level README with:
   - project purpose,
   - local run instructions,
   - architecture overview,
   - feature status.
5. Add focused tests for high-risk flows (challenge request acceptance/review and message thread behavior).
