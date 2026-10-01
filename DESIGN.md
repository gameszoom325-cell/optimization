# KNOXXZONE Motion & Visual System

## Runtime and deployment

- `index.html` is the application entry point. It links `styles/globals.css`, `styles/animations.css`, and `styles/effects.css` using relative URLs so the styles ship with a static-site deployment.
- GSAP and ScrollTrigger are local scripts loaded before the inline bootstrap. Three.js is requested asynchronously for fine-pointer, wide layouts only; Lenis remains in `assets/vendor/` but is not loaded by the page. ScrollTrigger is registered before triggers are created.
- Framer Motion and React are not part of this static HTML site; there are no React components or hooks to mount. Do not add React-only animation code unless the app is migrated to a React build.
- Deploy the HTML, `styles/` directory, and this design record together. There is no package manifest or build command in this workspace; Vercel serves the static files directly.
- GSAP/ScrollTrigger provide restrained text and visual entrances. If they are unavailable, `animations.css` and a one-time IntersectionObserver reveal the same content without leaving split text invisible.

## Motion principles

- Motion should explain depth, hierarchy, and state; avoid animating every character continuously.
- Honor `prefers-reduced-motion`; reduced-motion mode removes transitions and continuous CSS motion, uses short GSAP entrances, and renders the AI core once.
- Viewport reveals use IntersectionObserver and enter once. GSAP uses short opacity/transform-only entrances with `play none none none`; there are no section pinning or parallax loops.
- Content images, icon SVGs, project art, the about illustration, AI-core halo, and journey orbit are initialized as separate visual groups. The page's content is static, so no subtree mutation observer is needed.
- Star, matrix, and Three.js rendering is limited to the relevant visible section and pauses when the tab is hidden. Resize work is animation-frame throttled.
- Coarse-pointer/narrow layouts keep a static CSS core and a sparse star field, omit the matrix and Three.js runtime, and disable decorative loops. Native smooth scrolling remains available.
- Section, glyph, card, image, SVG illustration, and icon entrances use short opacity and small transform changes. Focus-visible outlines preserve keyboard feedback without relying on motion.
- Respect browser visibility and let CSS retain the readable layout if JavaScript or WebGL is unavailable.
- Keep real content available as a single visually-hidden accessible text alternative when decorative split glyphs are generated.

## Scene choreography

| Scene | Color | Entrance | Scroll / exit |
|---|---|---|---|
| Hero | Cyan / blue | Heading, description, and actions rise in a short stagger; the desktop core loads asynchronously | Lightweight background motion pauses when the hero leaves view |
| About | Violet / blue | Copy and identity visualization reveal with opacity and a small vertical offset | Accent updates when the section becomes active |
| Diagnostics | Green | Terminal lines appear once; skill bars scale in with transform | Matrix animation runs only while the panel is visible |
| Projects | Orange / cyan | Cards reveal in place; illustrations remain clear of their titles and descriptions | Fine-pointer tilt and a small hover lift; no cursor-following glow |
| Skills | Violet | Capability modules reveal in a short stagger | Cards use a subtle border and transform transition |
| Journey | Violet / blue | Timeline beam scales through the steps; nodes use opacity and scale | Horizontal desktop line and vertical narrow-screen line |
| Contact / future | Pink / orange | Copy and actions reveal in place before the footer | No pinned scene or full-motion exit |

## Typography behavior

- Major headings split into characters; paragraph and UI copy split into words. Each original string is retained for assistive technology.
- GSAP staggers heading glyphs with a short opacity and upward transform entrance; paragraphs use a smaller offset without blur or 3D rotation.
- Text entrances run once when content enters the viewport; they do not replay on every scroll pass.
- Animated text retains an accessible plain-text label, and interactive links receive an explicit accessible name before their descendants are split.

## Color system

- `--accent`, `--accent-rgb`, and `--accent-secondary` are set by the active `[data-world]` scene.
- Hero: cyan / blue. AI and journey: violet / blue. Projects: orange / pink. Hacker diagnostics: green. Contact/future: pink / violet.
- Glows use the current accent rather than a fixed color wherever possible. Scene updates are driven by IntersectionObserver, independent of GSAP.

## Hover and pointer interactions

- Fine pointers get a small dot and ring that update directly with the pointer; there is no idle cursor animation loop or trail.
- Magnetic calls-to-action and slight card tilt are enabled only for fine pointers and when reduced motion is not requested.
- Project and skill surfaces lift slightly and transition their borders. Focus-visible rings provide a keyboard equivalent.

## Integration audit checklist

- Verify stylesheet requests for all three `styles/*.css` assets return successfully after deployment.
- In a normal-motion browser, confirm ScrollTrigger registers and attaches to text, card, and journey animations.
- Scroll from the first section through the footer; verify reveals occur once, cards remain legible, and progress bars animate into view.
- Confirm mobile and coarse-pointer layouts do not request Three.js and keep the matrix/background motion disabled.
- In a reduced-motion browser, verify content remains visible and continuous CSS/canvas animation is stopped.
- Confirm all headings and paragraphs retain their accessible text labels and no console/runtime errors appear.
- Verify 1920px, 1440px, 1366px, tablet, 390px, and 360px layouts, keyboard navigation, and direct hash navigation after publishing the complete static asset set.
