# 小芽成长 · Design Spec

## Subject
Mobile companion for a child who turns **4 on 2026-10-18** (now ~47 months).
Job: parent opens phone → **today’s timed play plan** across 《3-6岁儿童学习与发展指南》 five domains.
Priority woven in: 汉字 / 英语 / 数学 / 逻辑思维 — balanced, not a drill app.
Time budget: **weekday 90 min · weekend 300 min**.

## Gender-open principle (hard rule)
- Pink is **visual identity only** (child likes pink) — never a content filter.
- Activities cover sports, construction, science, outdoor adventure, messy play, leadership, art, emotion — **no “boys’ games / girls’ games”**.
- Copy never says 小姑娘应该 / 男孩子才会. Invite: 「想试哪个就试哪个」.
- Every daily plan includes a **自选角** slot: child picks any activity style.
- Language avoids soft-only verbs for her; use 探索、搭建、挑战、闯关、观察 equally.

## Style anchor
Apple iOS Liquid Glass, **child-loved pink** — frosted rose glass over candy-mist canvas, bubbly orbs. Parent holds the phone; content stays wide-open.

## Palette
| Token | Hex | Use |
|-------|-----|-----|
| canvas | `#F9EAF2` | rose-mist background |
| canvas-deep | `#F3D6E7` | gradient depth |
| ink | `#2B1B24` | primary text |
| muted | `#8A6B7A` | secondary |
| glass | `rgba(255,255,255,0.68)` | cards / tab bar |
| glass-edge | `rgba(255,255,255,0.82)` | borders |
| pink | `#FF2D95` | primary accent / CTA |
| pink-soft | `#FF6B9D` | hero fills |
| health | `#5CD6A0` | 健康 |
| language | `#FFB07C` | 语言 |
| social | `#FF6B9D` | 社会 |
| science | `#A78BFA` | 科学 |
| art | `#F472B6` | 艺术 |
| focus | `#FF2D95` | priority badges |

## Typography
- Display / UI: `SF Pro Display, SF Pro Text, PingFang SC, Noto Sans SC, system-ui, sans-serif`
- Mono data: `ui-monospace, SF Mono, Menlo, monospace`
- Scale: hero 34px/700 · section 20px/600 · body 15px/1.5 · caption 12px/500

## Layout
- 390×844 mobile-first, 16px gutters
- Floating pink glass header → time ribbon → activity stack → tab bar
- Weekday 3–4 cards + 自选角; weekend 6–8 + 自选角

## Signature
1. Pink **time ribbon** (domains × minutes)
2. **距 4 岁还有 N 天** mono badge
3. **自选角** — child-driven choice, not parent-assigned only

## Motion
Stagger card rise + check spring; honor `prefers-reduced-motion`.

## Pages
| Route | Purpose |
|-------|---------|
| `/` | 今日计划 + 自选角 + 勇气练习 |
| `/domains` | 五大领域 + 《指南》 + 不设限/勇敢表达说明 |
| `/stories` | 睡前 AI 故事提示词（黑猫警长 / 警察梦 / 互动长故事） |
| `/week` | 本周节律（保留，侧入口） |
| `/progress` | 打卡与覆盖 |

## Daughter interests (content brief)
- Dream: become a police officer
- Loves: 黑猫警长, long stories, interactive stories
- Bedtime: chats with 豆包 / 元宝 / 千问
- Growth needs: courage to say stop / seek help when bullied
- Story prompts live in `lib/stories.ts`, shown on `/stories` with copy buttons

## Delivery
Next.js 15 + pnpm + GitHub Actions → Pages (`/grow-up`) + root phone `index.html`.
