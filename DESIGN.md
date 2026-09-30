# KNOXXZONE Motion & Visual System

## Runtime and deployment

- `index.html` is the application entry point. It links `styles/globals.css`, `styles/animations.css`, and `styles/effects.css` using relative URLs so the styles ship with a static-site deployment.
- Three.js, GSAP, ScrollTrigger, and Lenis are browser globals loaded before the page's inline bootstrap script. ScrollTrigger is registered before its triggers are created.
- Framer Motion and React are not part of this static HTML site; there are no React components or hooks to mount. Do not add React-only animation code unless the app is migrated to a React build.
- Deploy the HTML, `styles/` directory, and this design record together. There is no package manifest or build command in this workspace; Vercel serves the static files directly.
- GSAP/ScrollTrigger provide the full-motion path. If they are unavailable, `animations.css` and the page's IntersectionObserver fallback reveal the same content without leaving split text invisible.

## Motion principles

- Motion should explain depth, hierarchy, and state; avoid animating every character continuously.
- Honor `prefers-reduced-motion`. Reduced-motion mode retains brief, low-distance entrance and text reveals but disables parallax, pinning, long scrub travel, and Lenis smoothing.
- Viewport reveals use the shared `.animate-text`, `.animate-image`, and `.animate-card` classes and a common ScrollTrigger helper. Triggers replay in both directions with `play reverse play reverse`; the reverse action provides the outro and resets the animation for the next pass.
- Section, glyph, card, and illustration entrances use bounded viewport ranges rather than one-way observers. The fallback IntersectionObserver also removes entered state on exit so assets can reveal again when revisited.
- Coarse-pointer/narrow layouts reduce stagger, depth rotation, blur, and parallax. Three.js renders independently of reveal tweens and keeps its own reduced-motion behavior.
- Respect browser visibility and let CSS retain the readable layout if JavaScript or WebGL is unavailable.
- Keep real content available as a single visually-hidden accessible text alternative when decorative split glyphs are generated.

## Scene choreography

| Scene | Color | Entrance | Scroll / exit |
|---|---|---|---|
| Hero | Cyan / blue | Title characters assemble from randomized 3D offsets; roles and supporting copy stagger in; AI core and particles respond to pointer | Scroll-triggered copy and section reveals reverse on exit and replay on return; full-motion camera parallax and depth retreat |
| About | Violet / blue | Section title resolves from blur; paragraphs reveal by word; identity visualization follows its scene | Copy eases away as the scene leaves; ambient color moves to the AI palette |
| Diagnostics | Green | Terminal lines type on in sequence; skill meters and diagnostic labels reveal | Terminal and progress UI fade/depth out; reduced motion uses short opacity transitions |
| Projects | Orange / cyan | Holographic modules and map/orbit art arrive from depth with fade, scale, and blur-to-sharp | Card and art reveals reverse on leave and replay on re-entry; hover tilt and cursor-following glow |
| Skills | Violet | Capability modules reveal in a staggered sequence with scanning borders | Modules return to depth on exit; compact reveal for reduced-motion users |
| Journey | Violet / blue | Timeline nodes activate in order and the progress beam draws through the steps | Progress reverses with scroll; vertical line on narrow screens |
| Contact / future | Pink / orange | Portal copy, direct email, and actions reveal as a final scene | Full-motion transition exits into the footer; reduced-motion mode keeps movement restrained |

## Typography behavior

- Major headings split into characters; paragraph and UI copy split into words. Each original string is retained for assistive technology.
- GSAP staggers heading glyphs through small-to-large scale, randomized translation/rotation/depth, and blur-to-sharp; its shared ScrollTrigger reverses the glyphs when the owning heading exits.
- Paragraph words reveal with a smaller y/depth offset. Their entrance timeline reverses into depth as the paragraph leaves, then plays again on either-direction re-entry.
- Eyebrows use a short scramble cycle; important headings can glitch occasionally; pointer/focus activates a short glyph wave.
- Animated text always has an accessible plain-text label. Interactive text links receive an explicit accessible name before their descendants are split.

## Color system

- `--accent`, `--accent-rgb`, and `--accent-secondary` are set by the active `[data-world]` scene.
- Hero: cyan / blue. AI and journey: violet / blue. Projects: orange / pink. Hacker diagnostics: green. Contact/future: pink / violet.
- Glows use the current accent rather than a fixed color wherever possible. Scene updates are driven by IntersectionObserver, independent of GSAP.

## Hover and pointer interactions

- Fine pointers get a small dot, eased follower, and trailing particles. Coarse pointers omit custom cursors.
- Magnetic calls-to-action and tilt cards are enabled only for fine pointers and when reduced motion is not requested.
- Project and skill surfaces lift with light-following glows. Focus-visible rings provide a keyboard equivalent.

## Integration audit checklist

- Verify stylesheet requests for all three `styles/*.css` assets return successfully after deployment.
- In a normal-motion browser, confirm ScrollTrigger registers and attaches to the scene, heading, paragraph, project, skill, and journey elements.
- Scroll from the first scene to the footer, then back to the top at least twice; verify text, cards, and visual assets hide/reverse on exit and replay on re-entry.
- Confirm visual cards and illustration elements carry `.animate-card` / `.animate-image`, and reveal triggers use `play reverse play reverse`.
- In a reduced-motion browser, verify short text/scene reveals still run and parallax/pinning/Lenis are skipped.
- Confirm all headings and paragraphs retain their accessible text labels and no console/runtime errors appear.
- Verify desktop, narrow mobile, and direct hash navigation after publishing the complete static asset set.
