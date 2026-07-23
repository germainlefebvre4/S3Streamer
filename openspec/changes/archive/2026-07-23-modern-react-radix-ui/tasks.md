## 1. Project Initialization & Tooling Setup

- [x] 1.1 Create the `/frontend` directory and bootstrap a modern Vite + React 19 + TypeScript app
- [x] 1.2 Install necessary development dependencies: `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `tailwindcss`, `@tailwindcss/vite`, `lucide-react`, and TypeScript declarations
- [x] 1.3 Configure Tailwind CSS in `/frontend` and write base global styles supporting dark theme by default
- [x] 1.4 Configure the Vite proxy in `vite.config.ts` to forward `/api` requests to the Express server at `http://localhost:3000` during development

## 2. API Integration & React State Management

- [x] 2.1 Implement the main custom hook `useFetchVideos` to encapsulate fetching, pagination, tags extraction, and deletion requests
- [x] 2.2 Create local storage hook `useGridConfig` to persist columns, rows, and page width selections under the key `s3streamer_grid_config`

## 3. UI Component Implementation (Tailwind + Radix Primitives)

- [x] 3.1 Build the `Header` component with modern responsive typography and layout
- [x] 3.2 Build the `Toolbar` component containing search inputs, the shuffle trigger, and the config trigger button
- [x] 3.3 Implement `GridConfigModal` using `@radix-ui/react-dialog` to support cols (1-8), rows (1-6), and page width selections
- [x] 3.4 Build the `VideoGrid` and `VideoCard` components with responsive Tailwind sizing, truncation, and scale/glow on hover
- [x] 3.5 Build the `Pagination` component centered with sliding numbered windows and ellipses
- [x] 3.6 Build the `TagPanel` component placed at the bottom of the page, rendering top 100 keywords as clickable badges
- [x] 3.7 Implement `VideoPlayerDialog` using `@radix-ui/react-dialog` featuring chevrons, range streaming, arrow keyboard navigation, and deletion trigger

## 4. Backend Serving & Pipeline Assembly

- [x] 4.1 Update `src/index.js` to serve production assets from `/frontend/dist` using robust path mapping
- [x] 4.2 Configure workspace build scripts in root `package.json` to compile and coordinate frontend & backend execution under single commands

## 5. System Validation & Verification

- [x] 5.1 Run full build and verify the responsive dark-themed UI on local machine
- [x] 5.2 Validate S3 streaming, deletion, pagination, keyboard controls, and tag filters
