## Why

S3Streamer currently uses a legacy monolithic Vanilla JS front-end (`index.html`) of over 1000 lines. Rebuilding the UI with React 19, TypeScript, Radix Primitives, and Tailwind CSS will improve modularity, clean up state management, introduce front-end type safety, enhance accessibility, and provide a highly modern, fluid, dark-themed streaming user interface.

## What Changes

- **SPA Transition**: Rewrite the entire UI as a modern Single Page Application (SPA) using React 19 and TypeScript.
- **Modern Dark Aesthetic**: Implement a sleek, dark-themed aesthetic (`bg-slate-950`) using Tailwind CSS, featuring modern glassmorphism elements, custom smooth transition animations, and refined layout spacing.
- **Radix Primitives Integration**: Leverage Radix UI accessible primitives for dialogs, modals, and tooltips, ensuring fully keyboard-navigable and keyboard-accessible UI controls.
- **Optimized Component Layout**:
  - Extract distinct component layers: `Header`, `Toolbar`, `VideoGrid`, `VideoCard`, `VideoPlayerDialog`, `GridConfigModal`, `TagPanel`, and `Pagination`.
  - Move the `TagPanel` component to the bottom of the page to keep the initial viewport clutter-free and focus on video discovery.
- **Modern Build Pipeline**: Establish a Vite compilation environment inside a `/frontend` subdirectory.
- **Express Serving**: Configure the Express backend to serve the compiled static build from `frontend/dist` in production, while using a Vite dev proxy for local development.

## Capabilities

### New Capabilities

*(None. All core capabilities are preserved.)*

### Modified Capabilities

- `video-listing`: Rebuild the video grid with Tailwind CSS cards, and move the `TagPanel` word-cloud component from the top/side to the bottom of the page to optimize viewport hierarchy.
- `grid-config`: Rebuild the grid dimensions configuration modal using a fully-accessible `Radix Dialog` primitive styled with Tailwind CSS.
- `video-dialog-navigation`: Rebuild the immersive video viewer and navigator using `Radix Dialog` with smooth, fully-styled modal transitions, keyboard arrow nav, and custom Tailwind controls.
- `video-delete`: Rebuild the delete confirmation overlay using `Radix Dialog` for accessibility and modern alert design.

## Impact

- **Codebase Structure**: Introduces a `/frontend` folder containing the Vite + React 19 + TypeScript SPA workspace.
- **Backend static serving**: Updates `src/index.js` to serve compiled assets from `/frontend/dist`.
- **Ecosystem**: Expands dependencies with `@radix-ui/*`, `tailwindcss`, `lucide-react`, `typescript`, and `vite`.
