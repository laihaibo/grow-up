import {
  ALL_ACTIVITIES,
  CHOICE_PROMPTS,
  DOMAIN_META,
  FOCUS_META,
  PRIORITY_FOCUS,
  ageInfo,
  isWeekend,
  minutesBudget,
  type Activity,
  type Domain,
  type FocusTag,
} from './activities'

export type ChoicePrompt = (typeof CHOICE_PROMPTS)[number]

export type PlanSlot = Activity & { done?: boolean }

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
  /** 性别开放：每天固定一个自选角，由孩子决定玩什么 */
  choice: ChoicePrompt
  /** 勇敢表达：近期成长重点之一，尽量每日露出 */
  braveFocus?: { title: string; hint: string }
}

const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function seedFromDate(dateKey: string) {
  let h = 2166136261
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i)
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

/** Deterministic daily plan grounded in age + weekday budget + priority bias */
const BRAVE_POOL = ALL_ACTIVITIES.filter((a) => a.id.startsWith('brave-'))

export function buildDayPlan(now = new Date()): DayPlan {
  const key = dateKey(now)
  const rnd = seedFromDate(key)
  const weekend = isWeekend(now)
  const budget = minutesBudget(now)
  const age = ageInfo(now)

  const pool = ALL_ACTIVITIES.filter((a) => {
    return true
  })

  const domains: Domain[] = ['health', 'language', 'social', 'science', 'art']
  const picked: Activity[] = []
  const used = new Set<string>()
  const focusHit = new Set<FocusTag>()

  function score(a: Activity) {
    let s = rnd()
    if (weekend && a.weekendBoost) s += 2.5
    if (!weekend && a.minutes > 25) s -= 1.2
    if (!weekend && a.minutes <= 15) s += 0.4
    // 近期重点：胆小、受欺负不会说 → 勇敢表达活动优先
    if (a.id.startsWith('brave-')) s += weekend ? 3.2 : 2.8
    const hasPrio = a.focus.some((f) => PRIORITY_FOCUS.includes(f))
    if (hasPrio) s += 1.6
    const newFocus = a.focus.filter((f) => !focusHit.has(f))
    s += newFocus.length * 0.35
    // slight domain balance
    const domainCount = picked.filter((p) => p.domain === a.domain).length
    s -= domainCount * 0.25
    if (a.weekendBoost && !weekend) s -= 2
    return s
  }

  const targetSlots = weekend ? 7 : 4
  const softMin = weekend ? 260 : 75
  const softMax = weekend ? 320 : 100

  // Ensure every domain appears at least once on weekend; weekday covers 4 domains min
  const domainOrder = shuffle(domains, rnd)
  const mustDomains = weekend ? domains : domainOrder.slice(0, 4)

  // seed: always try to include one brave activity when available
  const braveSeed = BRAVE_POOL.slice().sort((x, y) => score(y) - score(x))[0]
  if (braveSeed) {
    picked.push(braveSeed)
    used.add(braveSeed.id)
    braveSeed.focus.forEach((f) => focusHit.add(f))
  }

  // seed one activity per must-domain
  for (const domain of mustDomains) {
    const candidates = pool
      .filter((a) => a.domain === domain && !used.has(a.id))
      .sort((x, y) => score(y) - score(x))
    const pick = candidates[0]
    if (pick) {
      picked.push(pick)
      used.add(pick.id)
      pick.focus.forEach((f) => focusHit.add(f))
    }
  }

  // fill remaining with highest score under time budget
  let total = picked.reduce((s, a) => s + a.minutes, 0)
  const guard = 40
  let loops = 0
  while (picked.length < targetSlots && loops < guard) {
    loops++
    const candidates = pool
      .filter((a) => !used.has(a.id))
      .map((a) => ({ a, s: score(a) }))
      .sort((x, y) => y.s - x.s)
    let added = false
    for (const { a } of candidates) {
      const next = total + a.minutes
      if (next <= softMax && (picked.length < targetSlots - 1 || next >= softMin * 0.7 || true)) {
        picked.push(a)
        used.add(a.id)
        a.focus.forEach((f) => focusHit.add(f))
        total = next
        added = true
        break
      }
    }
    if (!added) {
      // relax: take shortest fitting activity
      const fallback = pool
        .filter((a) => !used.has(a.id) && a.minutes + total <= softMax + 20)
        .sort((x, y) => x.minutes - y.minutes)[0]
      if (!fallback) break
      picked.push(fallback)
      used.add(fallback.id)
      fallback.focus.forEach((f) => focusHit.add(f))
      total += fallback.minutes
    }
  }

  // trim if over soft max (never drop the only brave activity first)
  while (total > budget + (weekend ? 40 : 15) && picked.length > 3) {
    const idx = picked
      .map((a, i) => ({ a, i }))
      .filter(({ a }) => a.minutes > 10 && !a.id.startsWith('brave-'))
      .sort((x, y) => y.a.minutes - x.a.minutes)[0]?.i
    if (idx === undefined) break
    total -= picked[idx].minutes
    picked.splice(idx, 1)
  }

  // order: brave + priority language/math first on weekday
  picked.sort((a, b) => {
    const ab = a.id.startsWith('brave-') ? 1 : 0
    const bb = b.id.startsWith('brave-') ? 1 : 0
    if (ab !== bb) return bb - ab
    const ap = a.focus.filter((f) => PRIORITY_FOCUS.includes(f)).length
    const bp = b.focus.filter((f) => PRIORITY_FOCUS.includes(f)).length
    if (weekend) return (b.weekendBoost ? 1 : 0) - (a.weekendBoost ? 1 : 0) || b.minutes - a.minutes
    return bp - ap || a.minutes - b.minutes
  })

  const domainMinutes = domains.map((domain) => {
    const minutes = picked.filter((p) => p.domain === domain).reduce((s, a) => s + a.minutes, 0)
    return {
      domain,
      name: DOMAIN_META[domain].name,
      color: DOMAIN_META[domain].color,
      emoji: DOMAIN_META[domain].emoji,
      minutes,
    }
  })

  const brave = picked.find((a) => a.id.startsWith('brave-'))
  return {
    dateKey: key,
    dateLabel: formatDateLabel(now),
    weekdayLabel: WEEK_CN[now.getDay()],
    isWeekend: weekend,
    budgetMinutes: budget,
    plannedMinutes: total,
    slots: picked.map((a) => ({ ...a })),
    domainMinutes,
    ageMonths: age.months,
    daysToFour: age.daysToFour,
    turnedFour: age.turnedFour,
    displayAge: age.displayAge,
    focusCoverage: Array.from(focusHit),
    choice: CHOICE_PROMPTS[Math.floor(rnd() * CHOICE_PROMPTS.length)],
    braveFocus: brave
      ? {
          title: brave.title,
          hint: '练习说“停”、走开、告诉老师/家长。告诉大人不是告状，是保护自己。',
        }
      : {
          title: '今日勇气一句',
          hint: '睡前回忆：今天有没有一件“说出来就很棒”的事？没有也没关系，明天继续练。',
        },
  }
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

export function describeFocus(f: FocusTag) {
  return FOCUS_META[f]
}
