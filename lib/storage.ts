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
  window.localStorage.setItem(KEY, JSON.stringify(store))
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
