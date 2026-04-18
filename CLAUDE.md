# CLAUDE.md — looq.amsterdam

Portfolio site for web agency looq.amsterdam. Russian-language, static HTML. The main interactive feature is a scroll-driven 3D bottle animation powered by Three.js + GSAP.

---

## Stack

| Layer | Tech |
|---|---|
| Markup | Vanilla HTML5 (`index.html`) |
| Styles | Vanilla CSS (`style.css`, `outlines.css`) — no preprocessors, no build step |
| 3D / Animation | Three.js r0.158 + GSAP 3.12.5 + ScrollTrigger — CDN, loaded lazily |
| Frame optimization | Node.js + `sharp` (`optimize-frames.js`) — dev-time tool only |
| CI/CD | GitHub Actions: `qa.yml` (QA Agent), `devops.yml` (DevOps Agent) |
| Hosting | GitHub Pages (`gh-pages` branch, deployed by DevOps Agent) |

No npm dependencies exist for the main site. `sharp` is only needed when running the frame optimizer locally.

---

## Development Commands

### Serve locally

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open http://localhost:8080. The bottle animation loads lazily — scroll to the `#bottle-demo` section to trigger it.

### Run the frame optimizer

```bash
npm install sharp          # one-time install
node optimize-frames.js ./frames ./frames-optimized
node optimize-frames.js ./frames ./frames-optimized 1400   # + resize to 1400px max
```

Output lands in `./frames-optimized/`. The script prints per-file savings and the method chosen (lossless vs q85+alpha=100).

### Trigger DevOps Agent manually

GitHub → Actions → "DevOps Agent" → Run workflow. Accepts optional `frames_dir` and `max_width` inputs.

---

## Team Agents

### QA Agent (`.github/workflows/qa.yml`)

**Triggers:** every push to `main` or `claude/**`; every PR targeting `main`.

| Job | What it checks |
|---|---|
| HTML Validation | `html5validator` on all `.html` files |
| Accessibility & Alt Texts | Fails on `<img>` without `alt=`; fails on missing `<title>`; warns on missing meta description |
| Image Size Audit | Warns on PNG/JPG > 500 KB; checks every `frame_*.png` has a `.webp` counterpart |
| JavaScript Lint | `node --check` on all `.js` files (syntax only) |
| Lighthouse CI | Serves on port 3000, runs one Lighthouse pass, uploads report. `continue-on-error: true` — advisory only |

### DevOps Agent (`.github/workflows/devops.yml`)

**Triggers:** push to `main` touching `frames/**` or `frames-raw/**`; manual workflow dispatch.

| Job | What it does |
|---|---|
| Auto-optimize Frame Sequences | Installs `sharp`, runs `optimize-frames.js`, commits result as `chore: auto-optimize frames → WebP [devops-agent]` |
| Asset Size Report | Generates size table (HTML/CSS/JS + frame dirs) into GitHub Actions summary |
| Deploy Preview | Publishes to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`. Excludes: `.github/`, `node_modules/`, `*.md`, `optimize-frames.js`, `frames-raw/`, `outlines.css`. `continue-on-error: true` |

---

## Architecture Decisions

### Why lazy-load Three.js + GSAP?

Three.js (≈600 KB) and GSAP (≈70 KB) have no value to users who never scroll to the bottle section. An `IntersectionObserver` with `rootMargin: '300px 0px'` fires the load 300px before the section enters viewport, hiding network latency behind scroll time. Scripts load sequentially because ScrollTrigger must register after GSAP.

### Why pause the render loop when off-screen?

A second `IntersectionObserver` on the `<canvas>` (threshold 0.01) pauses `requestAnimationFrame` when canvas is not visible. On a 300vh scroll section the canvas spends significant time off-screen — pausing saves GPU and battery.

### Why WebP for all frames?

WebP saves 40–70% over PNG for photorealistic renders. The optimizer auto-selects:
- **Lossless WebP** — better for flat CGI with few colours and no noise.
- **q85 + alphaQuality=100 WebP** — better for photorealistic glass/highlight renders with alpha.

Both are generated and the smaller one is kept. Alpha channel fidelity is preserved in both cases.

### Why Three.js over Lottie?

The bottle is a parametric 3D object with real-time specular highlights, rim lighting, and a physically plausible glass material. Lottie only handles SVG/vector motion. Three.js gives scroll-reactive 3D that Lottie cannot produce.

### Why no build tools?

The site is three files (HTML, CSS, JS). Webpack/Vite would add a build step and `node_modules` for no meaningful gain. The frame optimizer is a dev-time Node script, separate from the site.

---

## File Structure

```
looq-amsterdam/
├── index.html              # Single-page portfolio (Russian)
├── style.css               # All site styles, including bottle section
├── outlines.css            # Dev helper — layout outlines (NOT deployed)
├── bottle-animation.js     # Three.js + GSAP scroll animation (IIFE, self-contained)
├── optimize-frames.js      # Node.js frame batch converter (dev tool, NOT deployed)
├── hero-bg.jpg             # Hero background image
├── *.svg / *.png           # Header/footer icons
├── frames/                 # Raw PNG animation frames (source of truth)
├── frames-raw/             # Optional: pre-resize originals
├── frames-optimized/       # Auto-generated WebP (committed by DevOps Agent)
└── .github/
    └── workflows/
        ├── qa.yml          # QA Agent
        └── devops.yml      # DevOps Agent
```

---

## Adding New Animation Frames

1. Export frames as PNG (transparent background), named sequentially: `frame_001.png`, `frame_002.png` …
2. Place in `./frames/`.
3. Preview savings locally:
   ```bash
   npm install sharp
   node optimize-frames.js ./frames ./frames-optimized 1400
   ```
4. Commit the raw PNG frames to `./frames/`. **Do not commit** `./frames-optimized/` manually.
5. Push to `main`. DevOps Agent detects the `frames/**` change, runs the optimizer, and commits the `.webp` output automatically.
6. If the animation is frame-based (canvas image sequence), update the frame count in JS. If using the procedural Three.js geometry (current default), no JS changes needed.

QA Agent warns if any `frame_*.png` lacks a `.webp` counterpart — resolved once DevOps Agent finishes.

---

## Known Limitations

- `body { min-width: 960px }` — site is not mobile-responsive yet.
- `outlines.css` must never be linked in `index.html` before deploying.
- The bottle is procedural geometry (parametric cylinders). To change the bottle shape, edit geometry params directly in `bottle-animation.js`. There is no external `.glb` asset.
- Footer email (`enot_neopoznanniy@gmail.com`) differs from header email (`info@looq.amsterdam`) — placeholder, should be unified.
- Lighthouse CI is advisory only (`continue-on-error: true`) — no score thresholds enforced.
