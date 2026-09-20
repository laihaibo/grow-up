import { SPEECH_FULL, MISSION_DAYS, missionForDate, isMissionWindow } from '../lib/mission'
import { getActivity } from '../lib/activities'
import { buildDayPlan } from '../lib/plan'

const expected =
  '小朋友们，大家好呀，我是小一班的赖潇语。老师和爸爸妈妈都告诉我，陌生人给的零食、糖果不能要。陌生人说带我去找爸爸妈妈我们也不能跟他走。遇到不认识的人，要赶紧找老师，保护好自己，不随便跟陌生人离开哦。'

console.log('speech_match', SPEECH_FULL === expected)
console.log('window_0920', isMissionWindow(new Date(2026, 8, 20)))
console.log('window_0923', isMissionWindow(new Date(2026, 8, 23)))
console.log('window_0924', isMissionWindow(new Date(2026, 8, 24)))
console.log('for_0921', missionForDate(new Date(2026, 8, 21))?.activityId)
console.log('for_0919', missionForDate(new Date(2026, 9, 1)))

for (const id of ['mission-brief', 'mission-snack', 'mission-follow', 'mission-drill']) {
  const a = getActivity(id)
  console.log('activity', id, !!a, a?.title, !!a?.coach)
}

const plan21 = buildDayPlan(new Date(2026, 8, 21))
console.log('plan_0921_slots', plan21.slots.map((s) => s.id).join(','))
console.log('plan_0921_mission', plan21.mission?.activityId, plan21.missionActivity?.id)

const planOutside = buildDayPlan(new Date(2026, 9, 10))
console.log('plan_1010_mission', planOutside.mission, planOutside.missionActivity)
console.log('plan_1010_has_mission_slot', planOutside.slots.some((s) => s.id.startsWith('mission-')))
