# Source Architecture

One-page immersive portfolio ("Night Signal") built with Next.js App Router,
Tailwind CSS v4, Framer Motion (micro-interactions), GSAP ScrollTrigger
(scroll storytelling), Lenis (smooth scrolling), and a Three.js/R3F particle
scene. Bilingual: English and Japanese via typed dictionaries.

## Directory Map

```
app/
├── layout.tsx              Root shell: fonts, metadata, providers, grain layer
├── page.tsx                Home composition - the full act-based journey
├── globals.css             Design tokens, fluid type scale, utilities, z-index scale
├── work/[slug]/page.tsx    Case-study route (SSG, generateStaticParams)
│
├── motion/                 Motion infrastructure
│   ├── gsap.ts             Single ScrollTrigger registration + easing constants
│   └── LenisProvider.tsx   Lenis <-> GSAP ticker sync; useSmoothScroll() hook
│
├── lib/
│   ├── data.ts             Language-neutral constants: identity, hero portraits,
│   │                       interests + media seeds, lab items, project meta/order
│   ├── content.ts          EN/JA dictionaries (Content interface guarantees parity)
│   └── motion.ts           Framer tokens: EASE, DUR, STAGGER, SPRING
│
├── hooks/
│   └── useMediaQuery.ts    matchMedia subscription hook
│
└── components/
    ├── Loader.tsx          IntroProvider + cinematic counter/wipe loader
    │                       (once per session, skipped under reduced motion).
    │                       useIntro().done gates all entrance choreography.
    ├── ContextCursor.tsx   Pointer-fine companion ring; morphs to labeled pill
    │                       for elements with data-cursor="View|Open|Write|Peek".
    ├── Navbar.tsx          Section-aware nav (IntersectionObserver highlight),
    │                       language toggle, fullscreen mobile menu, scroll bar
    ├── sections/
    │   ├── Hero.tsx               Spotlight-portrait hero, oversized split name,
    │   │                          metadata rail, cursor parallax depth layers
    │   ├── Manifesto.tsx          Pinned stage: particle wave + word-by-word
    │   │                          scroll-scrubbed statement illumination
    │   ├── WorkReel.tsx           Selected work as horizontal pinned reel
    │   │                          (GSAP pin/scrub + velocity skew; vertical stack
    │   │                          on mobile/reduced-motion via CSS orientation)
    │   ├── ExperienceChapters.tsx Career chapters; sticky giant year rail swaps
    │   │                          per chapter (ScrollTrigger toggles)
    │   ├── Capabilities.tsx       Typographic wall grouped by domain
    │   ├── AboutSection.tsx       Sticky media frame + interest index that swaps
    │   │                          imagery on hover/focus/tap
    │   ├── LabStrip.tsx           The page's single marquee of experiments
    │   ├── CaseStudy.tsx          Longform storytelling: parallax plates, sticky
    │   │                          numerals, asymmetric feature grid, next teaser
    │   └── ContactFinale.tsx      Full-viewport closing statement, email CTA,
    │                              socials, footer meta (absorbed the old Footer)
    ├── home/
    │   └── Scene.tsx       GLSL particle wave (R3F). progressRef-driven;
    │                       `active` prop pauses the render loop offscreen
    └── ui/
        ├── MaskedText.tsx  Word-mask headline reveal (onMount / inView / play gate)
        ├── RolloverText.tsx Per-char dual-text hover rollover (CSS-driven)
        ├── Magnetic.tsx     Spring cursor-follow wrapper
        ├── PageTransition.tsx Two-tone cover wipe on client-side navigation
        ├── TiltCard.tsx     Perspective tilt (kept for reuse)
        └── ScrollProgress.tsx Navbar progress hairline

public/images/              Portrait pair used by the hero spotlight engine
```

## Design System

Tokens live in `globals.css` under `@theme`:

- **Color** - `night #080a0f`, `elevated #0e1219`, `ink #f2f6f7`,
  `muted #96a2b0`, accent teal `#00b5a5` (+`bright #2ee6d6`), amber `#ffc700`
  reserved for rare highlights, `line` hairline, `on-accent` text on teal.
  One palette, locked across every section.
- **Type** - Space Grotesk display, Geist body, JetBrains Mono metadata,
  Noto Sans JP override in Japanese mode. Fluid scale utilities:
  `.text-hero`, `.text-display`, `.text-title`, `.text-section`, `.text-lede`.
  `.text-outline` is the second typographic voice (stroke-only display type).
- **Layout** - `.container-x` gutter/measure wrapper (max 1400px).
- **Texture** - `.grain::after` fixed film-grain layer (never on scroll containers).

### Z-index Scale (documented in globals.css)

0 content | 10 section media | 20 pinned UI | 40 navbar | 60 route cover |
70 mobile menu | 80 context cursor | 85 grain | 90 loader | 100 skip link.

## Motion Architecture

Two engines with strict ownership, never mixed in one tree:

1. **GSAP ScrollTrigger** owns scroll storytelling: the work reel pin +
   horizontal scrub (`start: "top top"`, `end: +=distance`, `scrub: 1`),
   velocity skew, experience chapter toggles. All setup runs inside
   `gsap.matchMedia()` / `gsap.context()` with revert cleanup.
2. **Framer Motion** owns micro-interactions, entrances, AnimatePresence
   transitions, and per-word scroll scrubs (manifesto, parallax figures).

**Lenis** (`motion/LenisProvider.tsx`) feeds scroll position to ScrollTrigger
through `lenis.on("scroll", ScrollTrigger.update)` on GSAP's ticker. Exposes
`useSmoothScroll().scrollTo(target)` for anchor navigation and back-to-top.

**Entrance choreography** is centralized through `useIntro()` from the
Loader: components hold hidden variants until `done` flips true.

**Reduced motion contract:** Lenis disabled, loader skipped, pins replaced by
static stacked layouts, reveals render final state, marquee/cursor disabled.
Every animated component guards explicitly.

## Data Flow

`content.ts` dictionaries (en/ja) hold ALL user-facing copy; TypeScript's
`Content` interface fails the build if either language misses a key.
`data.ts` holds language-neutral plumbing: identity, portrait paths,
project links/stack/order, interest seeds, lab items. Components read copy
via `useLang()`; case-study pages additionally resolve `caseStudies[slug]`.

Project imagery is placeholder (`picsum.photos` seeded via
`projectImage(key, w, h, variant)`) - swap by editing that one helper once
real screenshots exist in `/public/images/projects/`.

## How To

- **Add a project**: append an entry to both dictionaries' `work.items`,
  add its key to `ProjectKey` + `projectOrder` + `projectMeta` in `data.ts`,
  and write its case study in both `caseStudies`. The reel, slug route
  (SSG), and next-project loop pick it up automatically.
- **Add a home section**: create `components/sections/<Name>.tsx`, compose it
  in `page.tsx` between acts, add its strings to both dictionaries, give it
  a unique layout family (no repeats), and register its id in Navbar
  `SECTIONS` if it should be navigable.
- **Add a reusable animation**: put shared timing/easing in `lib/motion.ts`
  (mirrored in CSS custom properties); put scroll machinery in
  `motion/gsap.ts` helpers; keep component-specific logic local.
- **Swap the hero portraits**: replace the two files in `/public/images/`
  or update `heroImages` in `data.ts`.

## Architectural Decisions

- **One-page experience**: routes `/work`, `/about`, `/skills`,
  `/experience`, `/contact` were absorbed into home sections;
  `next.config.ts` redirects old URLs to their anchors. Only
  `/work/[slug]` remains a separate route (deep-linkable case studies).
- **Loader gating**: session-flagged so repeat visits skip straight to the
  hero; SSR always renders the overlay to avoid first-paint flash.
- **Wave placement**: moved from a dedicated 420vh ScrollScene into the
  manifesto backdrop where it serves one quiet act instead of dominating.
- **Cursor policy**: native pointer stays visible; the companion ring only
  adds affordance labels, keeping keyboard/touch users unaffected.
