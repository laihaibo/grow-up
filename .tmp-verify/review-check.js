const expected =
  '小朋友们，大家好呀，我是小一班的赖潇语。老师和爸爸妈妈都告诉我，陌生人给的零食、糖果不能要。陌生人说带我去找爸爸妈妈我们也不能跟他走。遇到不认识的人，要赶紧找老师，保护好自己，不随便跟陌生人离开哦。'
const m = require('./mission.js')
const lines = []
lines.push('speech_match=' + (m.SPEECH_FULL === expected))
lines.push('speech_bytes=' + Buffer.from(m.SPEECH_FULL).equals(Buffer.from(expected)))
for (let i = 0; i < 4; i++) {
  const d = new Date(2026, 8, 20 + i)
  lines.push('for_' + (20 + i) + '=' + (m.missionForDate(d) && m.missionForDate(d).activityId))
}
lines.push('null_0919=' + m.missionForDate(new Date(2026, 8, 19)))
lines.push('null_0924=' + m.missionForDate(new Date(2026, 8, 24)))
lines.push(
  'window_edges=' +
    [
      m.isMissionWindow(new Date(2026, 8, 20)),
      m.isMissionWindow(new Date(2026, 8, 23)),
      m.isMissionWindow(new Date(2026, 8, 19)),
      m.isMissionWindow(new Date(2026, 8, 24)),
    ].join(','),
)
const p = require('./plan.js')
const plan21 = p.buildDayPlan(new Date(2026, 8, 21))
lines.push('plan21_slots=' + plan21.slots.map((s) => s.id).join(','))
lines.push(
  'plan21_mission=' +
    (plan21.mission && plan21.mission.activityId) +
    '/' +
    (plan21.missionActivity && plan21.missionActivity.id),
)
const out = p.buildDayPlan(new Date(2026, 9, 10))
lines.push('plan1010_mission=' + out.mission + '|' + out.missionActivity)
lines.push('plan1010_has_mission=' + out.slots.some((s) => s.id.startsWith('mission-')))
const p20 = p.buildDayPlan(new Date(2026, 8, 20))
lines.push('plan20_slots=' + p20.slots.map((s) => s.id).join(','))
lines.push('plan20_mission=' + (p20.mission && p20.mission.activityId))
const p22 = p.buildDayPlan(new Date(2026, 8, 22))
lines.push('plan22_slots=' + p22.slots.map((s) => s.id).join(','))
const a = require('./activities.js')
const c = require('./coach.js')
for (const id of ['mission-brief', 'mission-snack', 'mission-follow', 'mission-drill']) {
  const act = a.getActivity(id)
  const coach = c.coachFor(id)
  const fallback = coach && coach.setup && coach.setup.indexOf('不用特殊材料') >= 0
  lines.push(
    id +
      '=act:' +
      !!act +
      ',title:' +
      (act && act.title) +
      ',coachScriptLen:' +
      (coach && coach.script && coach.script.length) +
      ',isFallback:' +
      fallback +
      ',hasBonus:' +
      !!(coach && coach.bonus),
  )
}
require('fs').writeFileSync(require('path').join(__dirname, 'review-out.txt'), lines.join('\n'), 'utf8')
console.log('wrote review-out.txt')
