## 1. CSS Stylesheet Refactoring

- [x] 1.1 Refactor `@keyframes contentShow` and `@keyframes contentHide` in `frontend/src/index.css` to animate only scale and opacity, avoiding double-translation conflicts
- [x] 1.2 Add `scrollbar-gutter: stable` to html and override `body[data-scroll-locked]` dynamic margin adjustments in `frontend/src/index.css`

## 2. Validation & Verification

- [x] 2.1 Execute `pnpm build` to compile the production bundle and verify no compilation/transpilation errors
- [x] 2.2 Verify layout stability and centering visually across active dialogs (grid config, video player dialog)
