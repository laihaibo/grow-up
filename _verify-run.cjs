const path = require("path");
const fs = require("fs");
function load(p) {
  const tries = [
    p,
    p.replace(".tmp-verify/lib/", ".tmp-verify/"),
    p.replace(".tmp-verify/lib/", ".tmp-verify/src/lib/"),
  ];
  for (const t of tries) if (fs.existsSync(t)) return require("./" + t.replace(/\\/g, "/"));
  throw new Error("missing " + p + " tried " + tries.join(","));
}
const mission = load(".tmp-verify/lib/mission.js");
const activities = load(".tmp-verify/lib/activities.js");
const plan = load(".tmp-verify/lib/plan.js");
const expected = "小朋友们，大家好呀，我是小一班的赖潇语。老师和爸爸妈妈都告诉我，陌生人给的零食、糖果不能要。陌生人说带我去找爸爸妈妈我们也不能跟他走。遇到不认识的人，要赶紧找老师，保护好自己，不随便跟陌生人离开哦。";
const lines = [];
lines.push("speech_match=" + (mission.SPEECH_FULL === expected));
lines.push("speech_value=" + mission.SPEECH_FULL);
lines.push("window_0920=" + mission.isMissionWindow(new Date(2026, 8, 20)));
lines.push("window_0923=" + mission.isMissionWindow(new Date(2026, 8, 23)));
lines.push("window_0924=" + mission.isMissionWindow(new Date(2026, 8, 24)));
lines.push("for_0921=" + (mission.missionForDate(new Date(2026, 8, 21))||{}).activityId);
for (const id of ["mission-brief","mission-snack","mission-follow","mission-drill"]) {
  const a = activities.getActivity(id);
  lines.push("activity " + id + " exists=" + !!a + " title=" + (a && a.title) + " coach=" + !!(a && a.coach && a.coach.script && a.coach.script.length > 0));
}
const plan21 = plan.buildDayPlan(new Date(2026, 8, 21));
lines.push("plan_0921_mission=" + ((plan21.mission||{}).activityId) + " slot=" + ((plan21.missionActivity||{}).id));
lines.push("plan_0921_ids=" + plan21.slots.map(s=>s.id).join(","));
const planOut = plan.buildDayPlan(new Date(2026, 9, 10));
lines.push("plan_1010_mission=" + planOut.mission + " activity=" + planOut.missionActivity);
lines.push("plan_1010_has_mission_slot=" + planOut.slots.some(s => s.id.startsWith("mission-")));
fs.writeFileSync("_verify-out.txt", lines.join("\n"), "utf8");
console.log(lines.join("\n"));
