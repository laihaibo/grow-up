import { readFileSync } from 'node:fs'
const s = readFileSync(new URL('../lib/activities.ts', import.meta.url), 'utf8')
const acts = [...s.matchAll(/id: '([^']+)'/g)].map((m) => m[1]).filter((x) => !x.startsWith('choice-'))
const choices = [...s.matchAll(/id: '(choice-[^']+)'/g)].map((m) => m[1])
const byDomain = {}
for (const m of s.matchAll(/domain: '(health|language|social|science|art)',[\s\S]*?id: '([^']+)'/g)) {
  // fallback below
}
// simpler: count domain lines near ids via sequential parse
const blocks = s.split(/\{\s*\n\s*id: '/).slice(1)
const domainCount = { health: 0, language: 0, social: 0, science: 0, art: 0 }
for (const b of blocks) {
  const id = b.split("'")[0]
  if (id.startsWith('choice-')) continue
  const dm = b.match(/domain: '(health|language|social|science|art)'/)
  if (dm) domainCount[dm[1]]++
}
console.log(JSON.stringify({
  activities: acts.length,
  unique: new Set(acts).size,
  brave: acts.filter((x) => x.startsWith('brave-')).length,
  open: acts.filter((x) => x.startsWith('open-')).length,
  weekendBoostIds: acts.filter((x) => x.startsWith('wk-')).length,
  choices: choices.length,
  domainCount,
  note: '每日计划由活动库按日期种子动态组合，非固定 N 天节目表',
}, null, 2))
