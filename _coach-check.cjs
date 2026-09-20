const { getActivity } = require("./.tmp-verify/activities.js");
const a = getActivity("mission-brief");
const lines = a.coach.script.filter(Boolean);
const hasName = lines.some((l) => l.includes("赖潇语"));
const hasClass = lines.some((l) => l.includes("小一班"));
const hasRaw = lines.some((l) => l.includes("${"));
require("fs").writeFileSync("_coach-check.txt", `hasName=${hasName}\nhasClass=${hasClass}\nhasRawTemplate=${hasRaw}\n`+lines.join("\n"), "utf8");
