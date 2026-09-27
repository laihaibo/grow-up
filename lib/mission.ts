/** 防诱拐演练任务：固定日历 + 背诵原文 + 逐日映射 */

import { CHILD_NAME, CLASS_NAME } from './child'

/** 演习日：2026-09-23 周三 */
export const DRILL_DATE = new Date(2026, 8, 23)
/** 练习窗口起点：2026-09-20 周日 */
export const MISSION_START = new Date(2026, 8, 20)

export type SpeechLine = {
  id: 'intro' | 'rule-snack' | 'rule-follow' | 'rule-teacher'
  label: string
  text: string
}

/** 幼儿园布置的背诵原文，逐字保留 */
export const SPEECH: SpeechLine[] = [
  {
    id: 'intro',
    label: '自我介绍',
    text: `小朋友们，大家好呀，我是${CLASS_NAME}的${CHILD_NAME}。`,
  },
  {
    id: 'rule-snack',
    label: '零食规则',
    text: '老师和爸爸妈妈都告诉我，陌生人给的零食、糖果不能要。',
  },
  {
    id: 'rule-follow',
    label: '跟人走规则',
    text: '陌生人说带我去找爸爸妈妈我们也不能跟他走。',
  },
  {
    id: 'rule-teacher',
    label: '求助收尾',
    text: '遇到不认识的人，要赶紧找老师，保护好自己，不随便跟陌生人离开哦。',
  },
]

export const SPEECH_FULL = SPEECH.map((l) => l.text).join('')

export type MissionDay = {
  dateKey: string
  date: Date
  weekdayLabel: string
  offsetLabel: string
  title: string
  theme: string
  activityId: string
  brief: string
}

function pad(n: number) {
  return `${n}`.padStart(2, '0')
}

export function missionDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function day(
  y: number,
  m: number,
  d: number,
  offsetLabel: string,
  title: string,
  theme: string,
  activityId: string,
  brief: string,
): MissionDay {
  const date = new Date(y, m, d)
  return {
    dateKey: missionDateKey(date),
    date,
    weekdayLabel: WEEK_CN[date.getDay()],
    offsetLabel,
    title,
    theme,
    activityId,
    brief,
  }
}

/** 固定四日日程（不读墙钟随机，保证同一天结果稳定） */
export const MISSION_DAYS: MissionDay[] = [
  day(
    2026,
    8,
    20,
    'D-3',
    '认识警员任务',
    '听简报 · 学自我介绍 · 认识三条安全口令',
    'mission-brief',
    '把演习当成黑猫警长见习任务：先听全文，再学第一句自我介绍。',
  ),
  day(
    2026,
    8,
    21,
    'D-2',
    '零食防线',
    '角色扮演 · 陌生人给零食/糖果',
    'mission-snack',
    '玩「警局补给站」：陌生人递零食时，摇头说不能要。',
  ),
  day(
    2026,
    8,
    22,
    'D-1',
    '跟人走陷阱',
    '角色扮演 · 说带你去找爸爸妈妈',
    'mission-follow',
    '有人哄你跟他走时：不跟走，转身找老师。',
  ),
  day(
    2026,
    8,
    23,
    'D0 · 演习日',
    '演习日彩排',
    '完整背诵 · 站姿音量 · 出门前充电',
    'mission-drill',
    '穿上「见习警员」身份，完整说一遍；说不完整也没关系，重点是敢开口。',
  ),
]

const START_KEY = missionDateKey(MISSION_START)
const DRILL_KEY = missionDateKey(DRILL_DATE)

export function isMissionWindow(d: Date) {
  const key = missionDateKey(d)
  return key >= START_KEY && key <= DRILL_KEY
}

export function missionForDate(d: Date): MissionDay | null {
  const key = missionDateKey(d)
  return MISSION_DAYS.find((day) => day.dateKey === key) || null
}

export function daysUntilDrill(d = new Date()) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const b = new Date(DRILL_DATE.getFullYear(), DRILL_DATE.getMonth(), DRILL_DATE.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}
