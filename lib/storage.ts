export type ProgressStore = Record<string, string[]> // dateKey -> activity ids done

const KEY = 'grow-up-progress-v1'

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ProgressStore) : {}
  } catch {
    return {}
  }
}

export function saveProgress(store: ProgressStore) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    // 存储满/隐私模式时静默失败，打卡只影响本次会话
  }
}

export function toggleActivity(dateKey: string, activityId: string): ProgressStore {
  const store = loadProgress()
  const list = new Set(store[dateKey] || [])
  if (list.has(activityId)) list.delete(activityId)
  else list.add(activityId)
  store[dateKey] = Array.from(list)
  saveProgress(store)
  return store
}

export function isDone(store: ProgressStore, dateKey: string, activityId: string) {
  return (store[dateKey] || []).includes(activityId)
}

// —— 每日计划的人工调整（换一批 / 换一个）——

export type PlanAdjust = {
  rerollSeed?: number
  exclude?: string[]
}

export type PlanAdjustStore = Record<string, PlanAdjust> // dateKey -> adjust

const ADJUST_KEY = 'grow-up-plan-adjust-v1'

export function loadPlanAdjust(): PlanAdjustStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(ADJUST_KEY)
    return raw ? (JSON.parse(raw) as PlanAdjustStore) : {}
  } catch {
    return {}
  }
}

function savePlanAdjust(store: PlanAdjustStore) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ADJUST_KEY, JSON.stringify(store))
  } catch {
    // 调整失败不影响主流程
  }
}

export function getPlanAdjustFor(store: PlanAdjustStore, key: string): PlanAdjust {
  return store[key] || {}
}

/** 换一批：为当天写入一个新的随机种子（非安全用途，仅提供抽选多样性；Math.random 只在 UI 边界使用，计划逻辑仍是纯函数） */
export function rerollPlan(dateKey: string): PlanAdjustStore {
  const store = loadPlanAdjust()
  const cur = store[dateKey] || {}
  store[dateKey] = { ...cur, rerollSeed: Math.floor(Math.random() * 0x7fffffff) }
  savePlanAdjust(store)
  return store
}

/** 换一个：把某条活动换下（当日不再出现），多次换累积生效 */
export function excludePlanActivity(dateKey: string, activityId: string): PlanAdjustStore {
  const store = loadPlanAdjust()
  const cur = store[dateKey] || {}
  const exclude = new Set(cur.exclude || [])
  exclude.add(activityId)
  store[dateKey] = { ...cur, exclude: Array.from(exclude) }
  savePlanAdjust(store)
  return store
}

// —— 故事页“讲过”标记 ——

/** storyId -> 讲过的日期列表 */
export type StoryToldStore = Record<string, string[]>

const STORY_KEY = 'grow-up-stories-v1'

export function loadStoryTold(): StoryToldStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORY_KEY)
    return raw ? (JSON.parse(raw) as StoryToldStore) : {}
  } catch {
    return {}
  }
}

export function toggleStoryTold(storyId: string, dateKey: string): StoryToldStore {
  const store = loadStoryTold()
  const list = new Set(store[storyId] || [])
  if (list.has(dateKey)) list.delete(dateKey)
  else list.add(dateKey)
  store[storyId] = Array.from(list)
  try {
    window.localStorage.setItem(STORY_KEY, JSON.stringify(store))
  } catch {
    // 忽略写入失败
  }
  return store
}

export function isStoryTold(store: StoryToldStore, storyId: string) {
  return (store[storyId] || []).length > 0
}
