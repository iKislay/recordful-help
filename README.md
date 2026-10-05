# recordful-help

Help Center for Recordful, served at `https://help.recordful.app`.

## Stack (why this, not scratch)

Fumadocs (MIT, free forever) on Next.js 16: docs layout, sidebar, search,
and MDX out of the box. Same Next.js major as `recordful-ee`, themed to
`recordful-eco/design.md` (paper `#FAF9F6`, charcoal, Outfit, one gradient
field on the home page). No licence cost, no vendor lock-in, content is
plain MDX in `content/docs/`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3001 (3000 is recordful-ee)
```

## Deploy (Vercel, subdomain)

1. New Vercel project from this folder, framework preset Next.js.
2. Add custom domain `help.recordful.app` (DNS: CNAME to `cname.vercel-dns.com`).
3. No env vars needed. `middleware.ts` redirects every legacy in-extension
   help URL (old `/getting-started/<id>/<slug>/<id>` shape) to clean
   `/docs/*` slugs, so the shipped extension keeps working with zero changes.

Deploy before submitting the Chrome Web Store listing: the extension links
to `help.recordful.app/*` in 9 places and reviewers open them.

## Adding media (owner task)

Articles contain `<MediaPlaceholder kind="..." label="..." />` where a real
screenshot, GIF or video belongs. Replace the tag with the real asset, keep
the same position. Sizes: screenshots 1280x800 to match the store set.

## Content map

`content/docs/`: getting-started (install, requirements, permissions,
camera-mic, whats-new), recording (modes, audio, toolbar, countdown-alarm,
camera-effects, limits), editing (trim-cut-mute, crop, audio-tracks, export,
five-minute-limit, drive-save), troubleshooting (memory-limit,
recording-stopped, unsupported-tab, recovery, offline), pro (free-vs-pro,
login, storage, share-links, contact).
