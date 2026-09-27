// 计划多样性校验：把 lib/*.ts 拷到临时目录并补上显式 .ts 扩展名，
// 再用 node --experimental-strip-types 运行（lib 内部是 TS 风格的无扩展名导入）。
// 用法: node scripts/verify-plan.mjs
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, '.verify-plan-tmp')

rmSync(tmp, { recursive: true, force: true })
mkdirSync(join(tmp, 'lib'), { recursive: true })
for (const f of readdirSync(join(root, 'lib')).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(root, 'lib', f), 'utf8')
  writeFileSync(join(tmp, 'lib', f), src.replace(/from '\.\/([a-zA-Z-]+)'/g, "from './$1.ts'"))
}

const runner = `
import { buildDayPlan } from './lib/plan.ts'
import { ALL_ACTIVITIES } from './lib/activities.ts'

const fmt = (d) => \`\${d.getMonth() + 1}/\${d.getDate()}\`
const start = new Date()
const plans = []
for (let i = 0; i < 14; i++) {
  const d = new Date(start); d.setDate(start.getDate() + i)
  plans.push(buildDayPlan(d))
}
console.log('=== 未来 14 天计划 ===')
plans.forEach((p) => {
  console.log(\`\${p.dateKey.slice(5)} \${p.weekdayLabel} | \${p.slots.length} 档 \${p.plannedMinutes}/\${p.budgetMinutes}分 | 主打\${p.featuredFocus} | \${p.slots.map((s) => s.id).join(',')}\`)
})
console.log('\\n=== 相邻/前3天/跨周重复 ===')
for (let i = 1; i < plans.length; i++) {
  const gaps = [1, 3, 5, 6, 7].filter((g) => i - g >= 0)
  const parts = gaps.map((g) => {
    const prev = new Set(plans[i - g].slots.map((s) => s.id))
    const dup = plans[i].slots.filter((s) => prev.has(s.id))
    return \`vs\${g}天前:\${dup.length}\`
  })
  console.log(\`\${plans[i].dateKey.slice(5)} \${plans[i].slots.length}档  \${parts.join('  ')}\`)
}
console.log('\\n=== 14 天去重统计 ===')
const count = new Map()
for (const p of plans) for (const s of p.slots) count.set(s.id, (count.get(s.id) || 0) + 1)
const sorted = [...count.entries()].sort((a, b) => b[1] - a[1])
console.log(\`共出现 \${count.size}/\${ALL_ACTIVITIES.length} 个不同活动；最高频: \${sorted.slice(0, 8).map(([id, n]) => \`\${id}×\${n}\`).join(', ')}\`)

console.log('\\n=== 确定性与换一批/换一个 ===')
const d0 = new Date()
const p1a = buildDayPlan(d0)
const p1b = buildDayPlan(d0)
console.log('同参数两次调用一致:', p1a.slots.map((s) => s.id).join() === p1b.slots.map((s) => s.id).join())
const p2 = buildDayPlan(d0, { rerollSeed: 12345 })
const p2b = buildDayPlan(d0, { rerollSeed: 12345 })
console.log('换一批两次一致:', p2.slots.map((s) => s.id).join() === p2b.slots.map((s) => s.id).join())
const p3 = buildDayPlan(d0, { exclude: [p1a.slots[0].id] })
console.log('换一个生效:', !p3.slots.some((s) => s.id === p1a.slots[0].id))
console.log('勇敢活动每日恰一个:', plans.every((p) => p.slots.filter((s) => s.id.startsWith('brave-')).length === 1))
const okSlots = plans.every((p) => (p.isWeekend ? p.slots.length >= 9 && p.plannedMinutes >= 240 : p.slots.length >= 5 && p.plannedMinutes >= 75))
console.log('档位/分钟达标:', okSlots)
`

writeFileSync(join(tmp, 'verify.mjs'), runner)
execSync(`node --experimental-strip-types "${join(tmp, 'verify.mjs')}"`, { stdio: 'inherit', cwd: tmp })
rmSync(tmp, { recursive: true, force: true })
