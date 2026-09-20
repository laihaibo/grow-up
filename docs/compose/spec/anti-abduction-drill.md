---
feature: anti-abduction-drill
status: delivered
updated: 2026-09-20
branch: main
commits: uncommitted
---

# 幼儿园防诱拐演练背诵日程

## Report

**What was built** — 在小芽成长中落地「防诱拐演习」专属演练任务：`lib/mission.ts` 固定演习日 2026-09-23 与四日角色扮演日程，背诵原文逐字保留（小一班 · 赖潇语）；四个 `mission-*` 活动与家长跟练话术写入活动库；`plan.ts` 仅在 2026-09-20～09-23 窗口内注入当日任务；`/mission` 页展示原文、日程、话术与打卡；今日页显示窗口入口与剩余天数。并行完成品牌芽苗 logo：生成 → 抠图 → 多尺寸 favicon/icon，并在 `layout.tsx` 按 `NEXT_PUBLIC_BASE_PATH` 前缀接入，保证 GH Pages `/grow-up` 下可加载。

**Verification** — `tsc --noEmit` PASS（exit 0）；`BASE_PATH=/grow-up next build` PASS（exit 0，路由含 `/mission`，`out/` 含 favicon/icon 资源）；逻辑脚本 PASS（原文逐字匹配、窗口边界 09-20/23 在内 09-24 在外、09-21 注入 `mission-snack`、10-10 无 mission 槽位、四条手写话术存在）；导出 HTML 图标 href 均为 `/grow-up/...`（复审确认）。

**Journey log**
- 透明背景 `image_gen` 被拒 → 改为品红底再键出 alpha，再合成品牌粉圆角 tile。
- 本环境 PowerShell 直接 `& node/git` 几乎无输出 → 用 `Start-Process` 重定向跑 node/tsc/build。
- git CLI 不可用，用户选择在主目录实现，跳过 worktree。
- Next 15 `metadata.icons` 不会自动加 basePath，必须手动前缀（评审 major，已修）。
- mission 活动若始终进入候选池，会在窗口外随机出现 → 改为仅窗口日、仅当日 id 入池。

## [S1] Problem

幼儿园下周三（2026-09-23）有防诱拐演习，小一班赖潇语需要在集体面前背诵一段安全提醒。家长需要可执行的逐日练习日程；孩子 4 岁、梦想当警察、喜欢黑猫警长，死记硬背容易抗拒，产品原则也反对刷题式训练。

## [S2] Design

### 决策（已确认）

| 轴 | 选择 |
|----|------|
| 交付形态 | 专属 `/mission` 演练任务页 + 逐日日程；首页窗口期内入口 |
| 演练日 | 2026-09-23（周三） |
| 姓名班级 | 原文：赖潇语 / 小一班 |
| 练习方式 | 仅游戏化角色扮演（黑猫警长 / 小小见习警员） |
| 工作区 | 用户同意在主目录实现（本机 git CLI 不可用，跳过 worktree） |

### 背诵原文（不可改写）

1. 自我介绍：小朋友们，大家好呀，我是小一班的赖潇语。
2. 零食规则：老师和爸爸妈妈都告诉我，陌生人给的零食、糖果不能要。
3. 跟人走规则：陌生人说带我去找爸爸妈妈我们也不能跟他走。
4. 求助收尾：遇到不认识的人，要赶紧找老师，保护好自己，不随便跟陌生人离开哦。

### 演练窗口与活动映射

| 日期 | 标签 | 活动 id | 分钟 | 领域 | 任务焦点 |
|------|------|---------|------|------|----------|
| 2026-09-20 周日 | D-3 · 认识警员任务 | `mission-brief` | 12 | social | 听全文、认识四句口令、自我介绍 |
| 2026-09-21 周一 | D-2 · 零食防线 | `mission-snack` | 12 | social | 角色扮演：陌生人给零食/糖果 → 拒绝 |
| 2026-09-22 周二 | D-1 · 跟人走陷阱 | `mission-follow` | 15 | social | 角色扮演：「带你找爸妈」→ 不跟走 + 找老师 |
| 2026-09-23 周三 | D0 · 演习日彩排 | `mission-drill` | 15 | social | 完整背诵 + 站姿音量 + 出门前充电 |

窗口定义：`[2026-09-20 00:00, 2026-09-23 23:59]`（含两端）。窗口外 `missionForDate` 返回 `null`；`mission-*` 不进入当日计划候选池。

### 模块契约

**`lib/mission.ts`**（framework-free）

- `CHILD_NAME = '赖潇语'`, `CLASS_NAME = '小一班'`
- `DRILL_DATE = new Date(2026, 8, 23)`
- `MISSION_START = new Date(2026, 8, 20)`
- `SPEECH: { id, label, text }[]` — 四句分拆，与原文逐字一致
- `SPEECH_FULL: string` — 四句拼接
- `MissionDay: { dateKey, date, weekdayLabel, offsetLabel, title, theme, activityId, brief }`（focus 在 Activity 上，不在 MissionDay）
- `MISSION_DAYS: MissionDay[]` — 固定四日
- `missionForDate(d: Date): MissionDay | null`
- `isMissionWindow(d: Date): boolean`
- `daysUntilDrill(d?: Date): number`
- `missionProgress` / `collectMissionDoneIds` — 打卡辅助

**`lib/activities-extra.ts`**：四个 `mission-*` 活动（social 为主）。

**`lib/coach.ts`**：四个 id 手写 `COACHES`；姓名班级从 `mission.ts` 常量插值。

**`lib/plan.ts`**：

- 候选池：`mission-*` 仅在窗口内且 `activityId === missionDay.activityId` 时入池。
- 窗口日 force-seed 当日 mission；trim 保护 `brave-` 与 `mission-`；排序 mission 优先。
- `DayPlan.mission` / `DayPlan.missionActivity`。

**`app/mission/page.tsx`**：侧入口（同 `/week`），原文分句、四日卡、话术展开、storage 打卡。

**`app/page.tsx`**：窗口期演练卡 + 剩余天数 + `/mission/` 链接。

**Logo / favicon**

- 源图 → `assets/logo-sprout.png`、`public/logo-mark.png`
- `public/icon-512.png`、`icon-192.png`、`favicon-32.png`、`favicon-16.png`、`apple-touch-icon.png`、`app/icon.png`
- `public/favicon.svg` 与根目录 `favicon.svg` 同步为芽苗 mark
- `layout.tsx` icons 经 `NEXT_PUBLIC_BASE_PATH` 前缀

### 产品约束映射

- 五大领域：主要 social，辅 language / 健康站姿
- 不刷题：每日一条角色扮演；完整背诵在 D0 彩排
- 自选角不受影响
- 进度 localStorage：`grow-up-progress-v1`

## [S3] Out of Scope

- 不改 GitHub Actions / 部署脚本
- 不新增 tab bar 项
- 不做后端
- 不改既有 brave 系列逻辑（仅并行 seed）
- 姓名不在设置页配置，改 `lib/mission.ts` 常量即可
- 本次不自动 git commit（git CLI 环境不可用；主目录实现）
- 根目录 `index.html` 手机模拟器未并入 mission 页（独立静态镜像，后续可跟）

## Tasks

- [x] T1: 新增 `lib/mission.ts`（原文、窗口、四日映射、日期查询） — acceptance: `missionForDate` 对 09-20..23 返回对应日，之外返回 null；`SPEECH_FULL` 与用户原文逐字一致 (covers: S2)
- [x] T2: activities-extra + coach 写入四个 mission 活动与跟练话术 — acceptance: `ALL_ACTIVITIES` 能 `getActivity` 到四个 id；`coachFor` 返回非 fallback 的手写话术 (covers: S2)
- [x] T3: `plan.ts` 窗口内注入当日 mission，并暴露 `mission` 字段 — acceptance: `buildDayPlan(2026-09-21)` 的 slots 含 `mission-snack`；窗口外 mission 为空且无 mission 槽 (covers: S2; depends: T1,T2)
- [x] T4: 实现 `/mission` 页面（原文、日程、话术、打卡） — acceptance: 构建产出 `/mission`；显示四句原文与四日卡片；可按 activityId 打卡 (covers: S2; depends: T1,T2)
- [x] T5: 今日页窗口期演练任务入口 — acceptance: 窗口内今日页渲染指向 `/mission/` 的任务卡，含当日标题与剩余天数 (covers: S2; depends: T1,T3,T4)
- [x] T6: Logo/favicon 落盘并接入 layout — acceptance: public 与 app/icon.png 存在；layout icons 在 BASE_PATH 构建下带 `/grow-up` 前缀；favicon.svg 为芽苗 mark (covers: S2)
- [x] T7: `tsc --noEmit` 且 `BASE_PATH=/grow-up next build` 通过 — acceptance: 两条命令退出码 0 (covers: S2; depends: T1-T6)
