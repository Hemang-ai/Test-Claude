# hemangai.com

Personal site for Hemang Upadhyay: strategic product leader and AI researcher.
Black-and-violet portfolio with a Three.js hero, smooth scrolling and scroll-driven motion.

## Stack

- Vite + React + TypeScript
- `motion` (Framer Motion) for page-load orchestration, scroll-linked reveals, magnetic buttons and 3D tilt cards
- `three` + `@react-three/fiber` + `@react-three/drei` for the hero scene: a cut-out puppet of Hemang built from his full-body illustration, plus an emissive orb and sparkles. The head turns and tilts toward the cursor, the nearer arm reaches for it, the other waves; the figure turns and parallaxes on scroll. The scene is lazy-loaded and falls back to a CSS portrait card when WebGL is unavailable or the visitor prefers reduced motion.
- `lenis` for smooth scrolling (disabled under reduced motion)
- Self-hosted Archivo variable font (`public/fonts`)

## Run locally

Requires Node.js 20.19 or newer (22 recommended; see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # serve the production build
```

## Edit content

All copy lives in `src/data/profile.ts`: identity and links, about text, impact stats, experience, selected work, talks, papers, articles, education and skills. Components only render what they find there.

Design tokens (colours, type scale, spacing, easing) live in `src/styles/tokens.css`.

Assets in `src/assets/` (processed by Vite): the headshot (`hemang.png`), the resume PDF linked from the Resume buttons, the Archivo font, and the puppet layers in `src/assets/puppet/`. `public/` holds `og.png` (social share image) and `favicon.svg`.

### Regenerate the puppet from a new illustration

The hero figure is cut from a single full-body illustration on a white background. `tools/rig.json` describes each layer (head, torso, arms, legs) as polygons in source-image pixels with a pivot point at the joint. To rebuild the layers:

```bash
pip install pillow
python3 tools/cut_layers.py path/to/illustration.png tools/rig.json src/assets/puppet
```

If the new picture has a different pose or size, adjust the polygons and pivots in `tools/rig.json` first.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.

1. In the repository settings, set Pages "Source" to **GitHub Actions**.
2. Merge to `main`. The site is served at `https://<owner>.github.io/<repo>/`.

For a custom domain (for example `www.hemangai.com`): add `public/CNAME` containing the domain, point DNS at GitHub Pages, and change the workflow's `VITE_BASE` to `/`.
