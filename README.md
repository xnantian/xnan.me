# xnan.me

Personal website for XNAN — an independent AI product builder.

## Local development

The site is intentionally framework-free: semantic HTML, modern CSS, and a small progressive-enhancement script.

```bash
npm run dev
```

Open <http://127.0.0.1:4173>.

## Quality checks

```bash
npm test
npm run build
```

The build output is written to `dist/`. Browser QA should cover 320×568, 390×844, 768×1024, 1280×800, and 1440×900, including `prefers-reduced-motion`.

## Files

- `index.html` — content, semantics, and metadata
- `styles.css` — design system, responsive layout, and motion
- `script.js` — reveal, pointer, and progressive-enhancement behavior
- `tests/site.test.mjs` — structural and content checks
- `scripts/build.mjs` — dependency-free static build
- `design/brief.md` — design rationale and acceptance criteria

## Deployment

The repository includes a `CNAME` for `xnan.me`. It can be deployed as a static site through GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any equivalent host.
