# AGENTS.md — Grow Up（小芽成长）

Mobile-first Next.js 15 static web app that turns China's《3-6岁儿童学习与发展指南》five domains into daily parent-child play plans for one specific child (turns 4 on 2026-10-18). Ships as a pure static export to GitHub Pages at `/grow-up`. All UI copy and content are in Chinese.

## Commands

- `pnpm install` — pnpm ≥ 9, Node ≥ 20 (CI pins pnpm 11 / Node 24 in the workflow)
- `pnpm dev` — dev server at localhost:3000
- `pnpm build` — static export to `out/`. Pages parity: `BASE_PATH=/grow-up pnpm build` (auto in CI via `GITHUB_ACTIONS`); `BASE_PATH=` for local no-prefix output
- `pnpm exec tsc --noEmit` — typecheck (there are no lint or test scripts)
- `node scripts/count-activities.mjs` — activity library stats
- `pnpm prepare:phone` — copies `out/index.html` over root `index.html`

## Layout

- `app/` — App Router pages, mostly client components (`/domains` is a static server component). `app/layout.tsx` wraps everything in `AppShell` (`app/components/AppShell.tsx`), the floating glass tab bar: 今日 `/` · 领域 `/domains` · 故事 `/stories` · 成长 `/progress`; `/week` is a side entry.
- `lib/` — framework-free data + logic (import with `@/lib/...`):
  - `activities.ts` — `Activity`/`Domain`/`FocusTag` types, `DOMAIN_META`, main activity library, `CHOICE_PROMPTS` (自选角); `activities-extra.ts` — additional activities merged into `ALL_ACTIVITIES`
  - `coach.ts` — per-activity parent scripts (`COACHES` map); `coachFor()` falls back to `coachFromActivity()`, which generates a concrete script from the activity's real steps
  - `plan.ts` — `buildDayPlan()`: deterministic daily plan seeded by date key (FNV-1a + mulberry32); weekday ~4 slots/90 min, weekend ~7 slots/300 min
  - `stories.ts` — bedtime AI story prompts (shown on `/stories` with copy buttons)
  - `storage.ts` — localStorage key `grow-up-progress-v1`: `{ dateKey: [activityId] }`
- `index.html` (repo root) — standalone, self-contained phone-simulator app (inline CSS/JS, zero build, no `_next` references); mirrors the Next app's design
- `DESIGN.md` — design spec and content brief; read before UI work
- Root `_*.txt` / `*.log` / `*.err` files are scratch command output, not source

## Hard constraints

- `output: 'export'` static site: no API routes, no server actions, images unoptimized. `trailingSlash: true` — internal links end with `/` (AppShell's `normalize()` handles basePath + trailing slash)
- basePath `/grow-up`: automatic in CI; locally pass `BASE_PATH=/grow-up pnpm build`. Client code reads `NEXT_PUBLIC_BASE_PATH`. Never add `assetPrefix` alongside basePath — double-prefixes `/_next` and breaks assets (see comment in `next.config.mjs`)
- Do **not** add a `packageManager` field to `package.json`; the pnpm version is pinned only in `.github/workflows/deploy.yml` (adding it conflicts with the Pages deploy)
- `public/.nojekyll` must stay so Pages doesn't ignore `_next` assets
- Plan determinism: same date → same plan. No `Math.random()` or wall-clock reads inside plan generation logic
- Progress is localStorage-only by design (data sovereignty, no backend). JSON export/import lives on `/progress` and merges by date

## Content & design rules (product principles, see DESIGN.md)

- **Gender-open is a hard rule**: pink is visual identity only, never a content filter. No gender-stereotyped copy (never 小姑娘应该 / 男孩子才会); every daily plan includes a 自选角 slot the child controls
- No drill/超前刷题 orientation; every activity traces to one of the five domains (健康/语言/社会/科学/艺术); 汉字/英语/数学/逻辑 are woven in, never dominant
- Coach copy must be parent-executable: 准备 → 跟练话术（可照读）→ 观察点 → 不想做时（→ 可选加分挑战）. New activities go in `lib/activities-extra.ts`; new scripts in `lib/coach.ts`
- Visual system is pink Liquid Glass (Apple-style frosted glass). Palette tokens are defined in DESIGN.md and duplicated in `app/globals.css` **and** root `index.html` — keep both in sync when changing tokens
- Mobile-first 390×844; honor `prefers-reduced-motion`

## Verify before handing off

```bash
pnpm exec tsc --noEmit && BASE_PATH=/grow-up pnpm build
```
