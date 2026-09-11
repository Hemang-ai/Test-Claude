# hemangai.com

Personal site for Hemang Upadhyay: strategic product leader and AI researcher.
Black-and-violet portfolio with a Three.js hero, smooth scrolling and scroll-driven motion.

## Stack

- Vite + React + TypeScript
- `motion` (Framer Motion) for page-load orchestration, scroll-linked reveals, magnetic buttons and 3D tilt cards
- `three` + `@react-three/fiber` + `@react-three/drei` for the hero scene (glass card with the headshot, emissive orb, orbit rings, sparkles). The scene is lazy-loaded and falls back to a CSS glass card when WebGL is unavailable or the visitor prefers reduced motion.
- `lenis` for smooth scrolling (disabled under reduced motion)
- Self-hosted Archivo variable font (`public/fonts`)

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # serve the production build
```

## Edit content

All copy lives in `src/data/profile.ts`: identity and links, about text, impact stats, experience, selected work, talks, papers, articles, education and skills. Components only render what they find there.

Design tokens (colours, type scale, spacing, easing) live in `src/styles/tokens.css`.

Assets in `public/`:

- `hemang.png` / `hemang.jpg`: headshot
- `Hemang_Upadhyay_Resume.pdf`: linked from the Resume buttons
- `og.png`: social share image
- `favicon.svg`

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.

1. In the repository settings, set Pages "Source" to **GitHub Actions**.
2. Merge to `main`. The site is served at `https://<owner>.github.io/<repo>/`.

For a custom domain (for example `www.hemangai.com`): add `public/CNAME` containing the domain, point DNS at GitHub Pages, and change the workflow's `VITE_BASE` to `/`.
