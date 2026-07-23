## Context

Tailwind CSS v4 modernizes transform utilities by compiling them to native CSS properties (like `translate: -50% -50%`). However, our custom keyframe animations (`contentShow` and `contentHide`) use the legacy `transform: translate(-50%, -48%)` syntax to achieve slide-up transitions. Browsers apply both properties concurrently, resulting in a severe double-translation layout shift of more than 100px. Furthermore, physical scrollbars toggled by Radix UI on systems like Linux create horizontal layout shifts.

## Goals / Non-Goals

**Goals:**
- Eliminate the double-translation layout shift on all modals and dialogs.
- Enforce rigid layout and scrollbar-gutter stability.
- Retain smooth, premium fade-and-zoom entrance and exit animations.

**Non-Goals:**
- Altering modal structures, components, or JavaScript logic.

## Decisions

### Decision 1: Refactor Keyframe Animations
- **Approach**: Remove all translation transforms from the `@keyframes contentShow` and `@keyframes contentHide` definitions in `index.css`. By leaving the centering translations entirely to Tailwind's compiled classes (`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`), we avoid conflicts. The animations will transition only `opacity` and `scale`.
- **Alternatives Considered**: Modifying Tailwind classes to avoid using `-translate-x-1/2` (discarded as it is less idiomatic and breaks standard centering).

### Decision 2: Viewport Scroll Gutter Stability
- **Approach**: Force the browser viewport to always reserve space for scrollbar tracks using `scrollbar-gutter: stable` in `html`. Override Radix UI's dynamic padding injection when scroll-locked by setting `--removed-body-scroll-bar-size: 0px !important`, ensuring no visual shifting occurs.

## Risks / Trade-offs

- **[Risk] Slight border/flicker on scrollbar track** → *Mitigation*: Our custom scrollbars are styled very subtly and match the background theme, so reserving a stable gutter looks completely natural and is much more stable than layout shifts.
