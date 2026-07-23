## Why

Opening a modal (like the grid configuration settings) or starting a video player causes a massive visual shift (greater than 100px) that breaks layout alignment and produces an extremely annoying flickering/jumping effect. This is caused by a CSS engine conflict under Tailwind CSS v4, where the class `-translate-x-1/2` compiles to a native `translate: -50% -50%` property, which collides with our custom `@keyframes contentShow` animation that specifies `transform: translate(-50%, -48%)`. The browser applies both translations together, resulting in a double translation of -100% of the modal's width.

## What Changes

- Modify our custom keyframe animations in the global CSS to animate only `opacity` and `scale`, leaving horizontal and vertical centering (`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`) to be handled statically and reliably by Tailwind.
- Enforce layout stability against scrollbar toggling.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
*(None)*

## Impact

- **Affected files**: `frontend/src/index.css`.
- **Ecosystem**: No new packages or backend updates required.
