import {
  ALL_ACTIVITIES,
  CHOICE_PROMPTS,
  DOMAIN_META,
  PRIORITY_FOCUS,
  ageInfo,
  isWeekend,
  minutesBudget,
  type Activity,
  type Domain,
  type FocusTag,
} from './activities'
import { missionForDate, type MissionDay } from './mission'

export type ChoicePrompt = (typeof CHOICE_PROMPTS)[number]

export type PlanSlot = Activity & { timeLabel: string }

/** 当日计划的人工调整：换一批的种子 + 手动换下的活动 */
export type PlanAdjust = {
  /** 换一批：UI 生成并存储的随机种子，改变当日抽选结果 */
  rerollSeed?: number
  /** 换一个：被换下、当日不再出现的活动 id */
  exclude?: string[]
}

export type DayPlan = {
  dateKey: string
  dateLabel: string
  weekdayLabel: string
  isWeekend: boolean
  budgetMinutes: number
  plannedMinutes: number
  slots: PlanSlot[]
  domainMinutes: { domain: Domain; name: string; color: string; minutes: number; emoji: string }[]
  ageMonths: number
  daysToFour: number
  turnedFour: boolean
  displayAge: string
  focusCoverage: FocusTag[]
  /** 今日主打的启蒙焦点，按日轮换（汉字/英语/数学/逻辑） */
  featuredFocus: FocusTag
  /** 性别开放：每天固定一个自选角，由孩子决定玩什么 */
  choice: ChoicePrompt
  /** 勇敢表达：每日露出，hint 跟随所选活动 */
  braveFocus?: { title: string; hint: string }
  /** 防诱拐演练：仅窗口日非空 */
  mission?: MissionDay | null
  missionActivity?: PlanSlot | null
}

const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const WEEKDAY_TIMES = ['放学后充电', '晚饭前', '晚饭后', '亲子时光', '睡前安静', '弹性时间']
const WEEKEND_TIMES = ['清晨唤醒', '上午主场', '上午加时', '午后时光', '午后主场', '傍晚充电', '傍晚加时', '晚间亲子', '睡前安静', '弹性时间']

/** 跨天轮换窗口：近 N 天出现过的活动会被降权（线性衰减，避免「每周六都一样」的周回声） */
const ROTATION_DAYS = 10
/** 递推链的固定锚点：从这天起逐日正推，保证「同一天 → 同一份计划」跨会话成立 */
const HISTORY_ANCHOR = new Date(2026, 0, 1)

/** 勇敢活动的专属提示：勇气卡 hint 跟随当日所选活动，不再是一句写死的文案 */
const BRAVE_HINTS: Record<string, string> = {
  'brave-stop': '在家练熟三步：说“停” → 走开 → 告诉大人。声音抖也没关系，说出口就是勇敢。',
  'brave-teacher': '明确告诉她：报告老师不是告状，是保护自己。回家练一句完整的话：“老师，请帮帮我。”',
  'brave-body-rules': '睡前聊一句：今天有没有让你不舒服的碰触？红灯部位谁都不能碰，说了爸妈永远站你这边。',
  'brave-scene-roleplay': '一次只练 1–2 个情景，把最难说出口的那一句多练几遍，明天换下一句。',
  'brave-voice-meter': '出门前用“勇敢大声”档说一遍今天最需要的那句话，给自己充上电。',
  'brave-trusted-adults': '把安全大人名单贴在看得见的地方，睡前再练一遍“我需要帮助。”',
  'brave-story-talk': '讲完故事问她：如果是你，你会怎么做？能说出一个办法就值得鼓掌。',
  'brave-power-pose': '明天出门前一起叉腰充电 20 秒，喊出“我可以保护自己！我说得出来！”',
  _default: '练习说“停”、走开、告诉老师/家长。告诉大人不是告状，是保护自己。',
}

function seedFromDate(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function formatDateLabel(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function dateKey(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 距 1970-01-01 的天数，用于按日轮换主打焦点 */
function dayNumber(d: Date) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
}

/** Deterministic daily plan grounded in age + weekday budget + priority bias */
const BRAVE_POOL = ALL_ACTIVITIES.filter((a) => a.id.startsWith('brave-'))

type Selection = { picked: Activity[]; total: number; focusHit: Set<FocusTag> }

/**
 * 单日选取核心：纯函数，只依赖 (date, adjust, recent)。
 * recent: activityId -> 距当天天数（越小越近），来自前几天的正典计划结果。
 */
function computeSelection(date: Date, adjust: PlanAdjust | undefined, recent: Map<string, number>): Selection {
  const key = dateKey(date)
  const rnd = seedFromDate(adjust?.rerollSeed ? `${key}#${adjust.rerollSeed}` : key)
  const weekend = isWeekend(date)
  const missionDay = missionForDate(date)

  const excluded = new Set(adjust?.exclude || [])
  const pool = ALL_ACTIVITIES.filter((a) => {
    // 演练活动只在窗口内、且仅当日那条进入候选池
    if (a.id.startsWith('mission-')) return missionDay ? a.id === missionDay.activityId : false
    if (excluded.has(a.id)) return false
    return true
  })

  // 关键：每个候选只抽一次随机键，评分变成纯函数，不再在比较器里反复消耗 rnd()
  const rank = new Map<string, number>()
  for (const a of pool) rank.set(a.id, rnd())

  const featured = PRIORITY_FOCUS[dayNumber(date) % PRIORITY_FOCUS.length]

  const picked: Activity[] = []
  const used = new Set<string>()
  const focusHit = new Set<FocusTag>()

  function take(a: Activity) {
    picked.push(a)
    used.add(a.id)
    a.focus.forEach((f) => focusHit.add(f))
  }

  function score(a: Activity) {
    let s = (rank.get(a.id) || 0) * 1.2
    if (weekend && a.weekendBoost) s += 0.7
    if (!weekend) {
      if (a.minutes > 25) s -= 1.0
      else if (a.minutes <= 15) s += 0.3
      // 长活动（周末加餐）不占工作日黄金档
      if (a.weekendBoost) s -= 1.2
    }
    // 今日主打焦点按日轮换，其余重点轻微加分
    if (a.focus.includes(featured)) s += 0.9
    else if (a.focus.some((f) => PRIORITY_FOCUS.includes(f))) s += 0.2
    // 勇敢槽位单独保证，其余位置少排同类
    if (a.id.startsWith('brave-')) s -= 0.3
    const newFocus = a.focus.filter((f) => !focusHit.has(f))
    s += newFocus.length * 0.25
    s -= picked.filter((p) => p.domain === a.domain).length * 0.3
    // 跨天轮换：近 10 天出现过的活动线性降权（昨天 -3.3 → 10 天前 -0.33）
    const ago = recent.get(a.id)
    if (ago !== undefined && ago <= ROTATION_DAYS) s -= 3.3 * (1 - (ago - 1) / ROTATION_DAYS)
    return s
  }

  const targetSlots = weekend ? 9 : 6
  const softMin = weekend ? 260 : 80
  const softMax = weekend ? 320 : 100

  const domains: Domain[] = ['health', 'language', 'social', 'science', 'art']
  const domainOrder = shuffle(domains, rnd)
  const mustDomains = weekend ? domains : domainOrder.slice(0, 4)

  // 每日必有一个勇敢表达活动：挑近期最少练的那条
  const braveSeed = BRAVE_POOL.filter((a) => !used.has(a.id) && !excluded.has(a.id))
    .map((a) => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s)[0]?.a
  if (braveSeed) take(braveSeed)

  // 演练窗口内注入当日防诱拐任务（确定性，按日历）
  if (missionDay) {
    const mAct = pool.find((a) => a.id === missionDay.activityId)
    if (mAct && !used.has(mAct.id)) take(mAct)
  }

  // 每个必选领域各取一条
  for (const domain of mustDomains) {
    const pick = pool
      .filter((a) => a.domain === domain && !used.has(a.id))
      .map((a) => ({ a, s: score(a) }))
      .sort((x, y) => y.s - x.s)[0]?.a
    if (pick) take(pick)
  }

  // 填充：既要凑够档位数，也要尽量贴近时间预算（softMin / softMax 都真实生效）
  let total = picked.reduce((s, a) => s + a.minutes, 0)
  let guard = 80
  while (guard-- > 0) {
    const needSlots = picked.length < targetSlots
    const needMinutes = total < softMin
    if (!needSlots && !needMinutes) break
    const pick = pool
      .filter((a) => !used.has(a.id) && total + a.minutes <= softMax)
      .map((a) => ({ a, s: score(a) }))
      .sort((x, y) => y.s - x.s)[0]?.a
    if (pick) {
      take(pick)
      total += pick.minutes
      continue
    }
    // 放宽：挑还能塞下的最短活动
    const fallback = pool
      .filter((a) => !used.has(a.id) && total + a.minutes <= softMax + 25)
      .sort((x, y) => x.minutes - y.minutes)[0]
    if (!fallback) break
    take(fallback)
    total += fallback.minutes
  }

  // 兜底修剪：超出预算太多时先砍最长的一条（勇敢/演练活动不动）
  while (total > minutesBudget(date) + (weekend ? 40 : 15) && picked.length > 3) {
    const idx = picked
      .map((a, i) => ({ a, i }))
      .filter(({ a }) => a.minutes > 10 && !a.id.startsWith('brave-') && !a.id.startsWith('mission-'))
      .sort((x, y) => y.a.minutes - x.a.minutes)[0]?.i
    if (idx === undefined) break
    total -= picked[idx].minutes
    picked.splice(idx, 1)
  }

  return { picked, total, focusHit }
}

// —— 正典计划链 + 会话级缓存 ——

/** dateKey -> 当天正典计划选中的活动 id（不含人工调整） */
const picksCache = new Map<string, string[]>()
/** (dateKey[+adjust 签名]) -> 完整计划缓存 */
const planCache = new Map<string, DayPlan>()

/** 保证 date 之前（含锚点以来）每一天的正典选片结果都已就绪 */
function ensurePicksUpTo(date: Date) {
  const pending: Date[] = []
  const d = new Date(date)
  for (let i = 0; i < 400; i++) {
    if (d < HISTORY_ANCHOR) break
    if (picksCache.has(dateKey(d))) break
    pending.unshift(new Date(d))
    d.setDate(d.getDate() - 1)
  }
  for (const pd of pending) {
    const recent = new Map<string, number>()
    for (let i = 1; i <= ROTATION_DAYS; i++) {
      const q = new Date(pd)
      q.setDate(q.getDate() - i)
      if (q < HISTORY_ANCHOR) break
      const ids = picksCache.get(dateKey(q))
      if (!ids) continue
      for (const id of ids) {
        const prev = recent.get(id)
        if (prev === undefined || i < prev) recent.set(id, i)
      }
    }
    const sel = computeSelection(pd, undefined, recent)
    picksCache.set(dateKey(pd), sel.picked.map((a) => a.id))
  }
  if (picksCache.size > 2000) {
    const drop = [...picksCache.keys()].slice(0, picksCache.size - 1000)
    drop.forEach((k) => picksCache.delete(k))
  }
}

/** date 当天看到的「近 7 天使用记录」（来自前几天的正典计划） */
function recentFor(date: Date): Map<string, number> {
  const recent = new Map<string, number>()
  for (let i = 1; i <= ROTATION_DAYS; i++) {
    const q = new Date(date)
    q.setDate(q.getDate() - i)
    if (q < HISTORY_ANCHOR) break
    const ids = picksCache.get(dateKey(q))
    if (!ids) continue
    for (const id of ids) {
      const prev = recent.get(id)
      if (prev === undefined || i < prev) recent.set(id, i)
    }
  }
  return recent
}

function adjustSig(adjust?: PlanAdjust) {
  if (!adjust) return ''
  const parts: string[] = []
  if (adjust.rerollSeed !== undefined) parts.push(`r${adjust.rerollSeed}`)
  if (adjust.exclude?.length) parts.push(`x${[...adjust.exclude].sort().join(',')}`)
  return parts.join('|')
}

export function buildDayPlan(now = new Date(), adjust?: PlanAdjust): DayPlan {
  const key = dateKey(now)
  const sig = adjustSig(adjust)
  const cacheKey = sig ? `${key}#${sig}` : key
  const cached = planCache.get(cacheKey)
  if (cached) return cached

  const weekend = isWeekend(now)
  const budget = minutesBudget(now)
  const age = ageInfo(now)

  // 跨天轮换：今天看到的近 7 天记录 = 前几天正典计划的真实结果
  ensurePicksUpTo(now)
  const recent = recentFor(now)

  const sel = computeSelection(now, adjust, recent)
  const missionDay = missionForDate(now)
  const featured = PRIORITY_FOCUS[dayNumber(now) % PRIORITY_FOCUS.length]

  // 展示顺序：演练/勇敢打头 → 主打焦点优先 →（工作日短任务在前 / 周末长活动在前）
  sel.picked.sort((a, b) => {
    const ab = a.id.startsWith('mission-') ? 2 : a.id.startsWith('brave-') ? 1 : 0
    const bb = b.id.startsWith('mission-') ? 2 : b.id.startsWith('brave-') ? 1 : 0
    if (ab !== bb) return bb - ab
    if (weekend) return (b.weekendBoost ? 1 : 0) - (a.weekendBoost ? 1 : 0) || b.minutes - a.minutes
    const ap = a.focus.includes(featured) ? 1 : 0
    const bp = b.focus.includes(featured) ? 1 : 0
    if (ap !== bp) return bp - ap
    return a.minutes - b.minutes
  })

  const times = weekend ? WEEKEND_TIMES : WEEKDAY_TIMES
  const slots: PlanSlot[] = sel.picked.map((a, i) => ({ ...a, timeLabel: times[i] || '弹性时间' }))

  const domainMinutes = (['health', 'language', 'social', 'science', 'art'] as Domain[]).map((domain) => {
    const minutes = slots.filter((p) => p.domain === domain).reduce((s, a) => s + a.minutes, 0)
    return {
      domain,
      name: DOMAIN_META[domain].name,
      color: DOMAIN_META[domain].color,
      emoji: DOMAIN_META[domain].emoji,
      minutes,
    }
  })

  const brave = slots.find((a) => a.id.startsWith('brave-'))
  const missionSlot = missionDay ? slots.find((a) => a.id === missionDay.activityId) || null : null
  const choiceRnd = seedFromDate(`${key}#choice`)

  const plan: DayPlan = {
    dateKey: key,
    dateLabel: formatDateLabel(now),
    weekdayLabel: WEEK_CN[now.getDay()],
    isWeekend: weekend,
    budgetMinutes: budget,
    plannedMinutes: sel.total,
    slots,
    domainMinutes,
    ageMonths: age.months,
    daysToFour: age.daysToFour,
    turnedFour: age.turnedFour,
    displayAge: age.displayAge,
    focusCoverage: Array.from(sel.focusHit),
    featuredFocus: featured,
    choice: CHOICE_PROMPTS[Math.floor(choiceRnd() * CHOICE_PROMPTS.length)],
    braveFocus: brave
      ? { title: brave.title, hint: BRAVE_HINTS[brave.id] || BRAVE_HINTS._default }
      : {
          title: '今日勇气一句',
          hint: '睡前回忆：今天有没有一件“说出来就很棒”的事？没有也没关系，明天继续练。',
        },
    mission: missionDay,
    missionActivity: missionSlot,
  }

  planCache.set(cacheKey, plan)
  if (planCache.size > 300) {
    const drop = [...planCache.keys()].slice(0, planCache.size - 150)
    drop.forEach((k) => planCache.delete(k))
  }
  return plan
}

export function buildWeekPreview(base = new Date()): DayPlan[] {
  const plans: DayPlan[] = []
  const start = new Date(base)
  const dow = start.getDay()
  // week starts Monday
  const offset = dow === 0 ? -6 : 1 - dow
  start.setDate(start.getDate() + offset)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    plans.push(buildDayPlan(d))
  }
  return plans
}
