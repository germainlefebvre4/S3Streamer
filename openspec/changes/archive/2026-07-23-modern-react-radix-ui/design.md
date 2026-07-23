## Context

S3Streamer is transitioning from a monolithic single-file Vanilla JS front-end (`index.html` under `src/public`) to a modern React 19 Single Page Application (SPA). The design must integrate the React application smoothly with the existing Express backend, maintaining simplicity for local execution and production deployment while providing an exceptional, dark-themed user experience.

The frontend will be built in a `/frontend` subdirectory using Vite, React 19, TypeScript, Tailwind CSS, and Radix UI Primitives.

## Goals / Non-Goals

**Goals:**
- Initialize and configure a modern React 19 + Vite + TypeScript application in `/frontend`.
- Set up Tailwind CSS with a modern dark theme (`bg-slate-950` / `text-slate-200`) and glowing aesthetic accents.
- Integrate Radix UI Primitives (specifically `@radix-ui/react-dialog` and `@radix-ui/react-tooltip`) for robust, accessible, keyboard-friendly modals.
- Extract the modular UI component hierarchy: `Header`, `Toolbar`, `VideoGrid`, `VideoCard`, `VideoPlayerDialog`, `GridConfigModal`, `TagPanel`, and `Pagination`.
- Relocate the `TagPanel` (word cloud filter) to the bottom of the page to avoid layout crowding.
- Update the Express backend to serve the compiled static build from `/frontend/dist` in production, and support local development proxying via Vite on port 5173.

**Non-Goals:**
- Rewriting the Express backend business logic, cache layer, or Amazon S3 client actions.
- Designing a custom video player from scratch; the native `<video>` element with default browser controls will be used inside the accessible Radix Dialog.
- Adding database support or authentication.

## Decisions

### Decision 1: React 19, Vite, and TypeScript inside `/frontend`
- **Rationale**: Vite provides extremely fast HMR (Hot Module Replacement) and compilation speed. TypeScript ensures front-end safety for S3 key structures and state types. React 19 is chosen to build a clean, modular component-driven interface.
- **Alternatives Considered**: 
  - *Webpack / CRA*: Discarded due to slower build times and legacy structure.
  - *No Bundler (Client-Side React via Script Tag)*: Discarded as it is incompatible with Radix UI Primitives and TypeScript, and offers a poor developer experience.

### Decision 2: Radix UI Primitives + Tailwind CSS
- **Rationale**: Radix UI Primitives provide fully accessible, unstyled foundation blocks (like Dialog and Tooltip) which allow complete styling freedom. Combined with Tailwind CSS, we can achieve high-fidelity dark-mode designs with interactive focus rings, glassmorphic overlays, and glowing borders without being constrained by pre-styled UI kits.
- **Alternatives Considered**:
  - *Radix Themes*: Discarded because Radix Themes brings its own opinions, and styling them to match a deeply custom dark-theme with glow effects is less flexible than Tailwind CSS.
  - *Pure CSS / Vanilla Styles*: Discarded due to high maintenance overhead and lack of developer velocity compared to Tailwind's utility-first approach.

### Decision 3: Express Serving `/frontend/dist`
- **Rationale**: To preserve a zero-configuration single-command execution (`pnpm start`), the Express server will serve static files from `/frontend/dist` in production. For local development, `vite.config.ts` will configure a proxy from port `5173` to the Express API on port `3000`, enabling seamless concurrent execution.
- **Alternatives Considered**:
  - *Separate Frontend & Backend Servers*: Discarded because a unified local bundle is easier to run and deploy.

### Decision 4: Component and State Architecture
- **State Location**: The main app state (current page, search text, active video, grid config) will live in `App.tsx` and be exposed through custom hooks (e.g., `useFetchVideos`). 
- **Grid Config Persistance**: Persist columns (`cols`), rows (`rows`), and page width (`width`) in local storage under the key `s3streamer_grid_config`. Apply page width to the outer container and column counts to Tailwind's grid layout dynamically using inline styles (`gridTemplateColumns: repeat(cols, minmax(0, 1fr))`).

## Risks / Trade-offs

- **[Risk] Path resolving issues on production Express server** → *Mitigation*: Configure the static middleware in `src/index.js` using a robust path resolver relative to the workspace root: `express.static(path.join(__dirname, '..', 'frontend', 'dist'))`.
- **[Risk] High-volume video list payload overhead** → *Mitigation*: The backend already calculates pagination and filters, so the React frontend only needs to fetch one page of data at a time using clean query params, keeping payload sizes minimal.
