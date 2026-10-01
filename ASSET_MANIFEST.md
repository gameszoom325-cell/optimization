# KNOXXZONE Asset Manifest

All first-party visual assets are procedural SVGs or CSS/canvas/Three.js graphics. There are no stock images, remote font dependencies, GLB models, video backgrounds, or audio files. SVGs are compact, resolution-independent, and kept as source files; there are no raster assets to compress.

## Brand, interface, and social icons

| Filename | Location | Type / dimensions | Purpose | Used by | Optimization |
|---|---|---|---|---|---|
| `brand-k.svg` | `assets/icons/brand-k.svg` | SVG, viewBox 0 0 64 64 | Brand mark and favicon | `index.html` favicon and navigation brand | Vector; no external dependencies |
| `github.svg` | `assets/icons/github.svg` | SVG, viewBox 0 0 24 24 | GitHub contact icon | `index.html` contact link | Vector |
| `linkedin.svg` | `assets/icons/linkedin.svg` | SVG, viewBox 0 0 24 24 | LinkedIn contact icon | `index.html` contact link | Vector |
| `instagram.svg` | `assets/icons/instagram.svg` | SVG, viewBox 0 0 24 24 | Instagram contact icon | `index.html` contact link | Vector |
| `email.svg` | `assets/icons/email.svg` | SVG, viewBox 0 0 24 24 | Email contact icon | `index.html` contact link | Vector |
| `portfolio.svg` | `assets/icons/portfolio.svg` | SVG, viewBox 0 0 24 24 | Portfolio contact icon | `index.html` contact link | Vector |
| `projects.svg` | `assets/icons/projects.svg` | SVG, viewBox 0 0 24 24 | Project/frontend skill icon | `index.html` frontend module | Vector |
| `ai.svg` | `assets/icons/ai.svg` | SVG, viewBox 0 0 24 24 | AI skill icon | `index.html` intelligence module | Vector |
| `machine-learning.svg` | `assets/icons/machine-learning.svg` | SVG, viewBox 0 0 24 24 | Data and machine-learning icon | `index.html` data module | Vector |
| `coding.svg` | `assets/icons/coding.svg` | SVG, viewBox 0 0 24 24 | Coding skill icon | `index.html` language and backend modules | Vector |
| `gaming.svg` | `assets/icons/gaming.svg` | SVG, viewBox 0 0 24 24 | Tooling/gaming icon | `index.html` workshop module | Vector |
| `education.svg` | `assets/icons/education.svg` | SVG, viewBox 0 0 24 24 | Education metadata icon | `index.html` about metadata | Vector |
| `contact.svg` | `assets/icons/contact.svg` | SVG, viewBox 0 0 24 24 | Location/contact metadata icon | `index.html` about metadata | Vector |

## Generated illustrations and effects

| Filename | Location | Type / dimensions | Purpose | Used by | Optimization |
|---|---|---|---|---|---|
| `universe-field.svg` | `assets/backgrounds/universe-field.svg` | SVG, viewBox 0 0 1600 1000 | Procedural AI-core atmosphere | `styles/effects.css`, hero grid | Scalable vector; layered as CSS background |
| `hud-overlay.svg` | `assets/backgrounds/hud-overlay.svg` | SVG, viewBox 0 0 1600 1000 | Corner HUD and reticle overlay | `styles/effects.css`, hero grid | Scalable vector; CSS background |
| `landwatch-map.svg` | `assets/backgrounds/landwatch-map.svg` | SVG, viewBox 0 0 900 540 | Procedural map/grid and location visualization | `styles/effects.css`, Landwatch project art | Scalable vector; no map-service dependency |
| `ai-core.svg` | `assets/illustrations/ai-core.svg` | SVG, viewBox 0 0 600 600 | AI core illustration behind the real-time Three.js canvas | `styles/effects.css`; preloaded in `index.html` | Scalable vector; preloaded because it is above the fold |
| `particle-glow.svg` | `assets/particles/particle-glow.svg` | SVG, viewBox 0 0 128 128 | Soft procedural glow texture behind the hero core | `styles/effects.css` | Tiny vector; CSS background |
| `noise.svg` | `assets/textures/noise.svg` | SVG, viewBox 0 0 180 180 | Procedural film-grain layer | `styles/effects.css`, fixed noise overlay | Small repeating SVG filter |
| `scanlines.svg` | `assets/textures/scanlines.svg` | SVG, viewBox 0 0 4 8 | Holographic scan-line overlay | `styles/effects.css`, fixed noise overlay | Vector; repeated at small CSS tile size |
| `boot-orbit.svg` | `assets/animations/boot-orbit.svg` | Animated SVG, viewBox 0 0 160 160 | Orbiting boot-sequence graphic | `index.html`, loader orbit | Native SVG animation; displayed at 160 × 160 CSS px |

## Shader source

| Filename | Location | Type / dimensions | Purpose | Used by | Optimization |
|---|---|---|---|---|---|
| `ai-core.vert.glsl` | `assets/shaders/ai-core.vert.glsl` | GLSL vertex shader | Three.js AI-core shell vertex transform | Fetched by `index.html` on HTTP(S); embedded fallback used for `file://` and load failures | Plain text; small; source remains human-readable |
| `ai-core.frag.glsl` | `assets/shaders/ai-core.frag.glsl` | GLSL fragment shader | Animated cyan/violet fresnel shell | Fetched by `index.html` on HTTP(S); embedded fallback used for `file://` and load failures | Plain text; small; source remains human-readable |

## Local runtime libraries

| Filename | Location | Type / version | Purpose | Used by | Optimization |
|---|---|---|---|---|---|
| `three-r128.min.js` | `assets/vendor/three-r128.min.js` | Minified JavaScript, Three.js r128 | Procedural interactive AI-core scene and particle systems | Loaded asynchronously by `index.html` on fine-pointer, wide layouts only | Minified production build; no model files |
| `gsap-3.12.5.min.js` | `assets/vendor/gsap-3.12.5.min.js` | Minified JavaScript, GSAP 3.12.5 | Motion timelines and scroll animation | `index.html` local script | Minified production build |
| `ScrollTrigger-3.12.5.min.js` | `assets/vendor/ScrollTrigger-3.12.5.min.js` | Minified JavaScript, ScrollTrigger 3.12.5 | Scroll-driven section and text choreography | `index.html` local script, registered with GSAP | Minified production build |
| `lenis-1.1.20.min.js` | `assets/vendor/lenis-1.1.20.min.js` | Minified JavaScript, Lenis 1.1.20 | Previously used smooth-scroll integration; retained as a vendored asset | Not loaded by `index.html` | Minified production build; no runtime request |

Third-party runtime notices and applicable license links are recorded in [`assets/vendor/README.md`](assets/vendor/README.md).

## Intentionally empty categories

- `assets/images/`: no raster photography or stock imagery is used; all visuals are vector or generated in-browser.
- `assets/videos/`: animated background video is unnecessary; the canvas, CSS, and SVG layers are interactive and lighter.
- `assets/models/`: all 3D forms are generated procedurally with Three.js.
- `assets/audio/`: the experience is silent by default; no sound files or autoplay audio are required.
- `assets/fonts/`: the page uses system font stacks to avoid remote font requests, licensing ambiguity, and font-loading layout shifts.

The empty-category notes are in the corresponding directory `README.md` files. The HTML, stylesheets, shader requests, and vendor scripts use project-relative paths so deployment does not depend on localhost or third-party asset CDNs.
