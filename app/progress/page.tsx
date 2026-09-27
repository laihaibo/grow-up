'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ACTIVITY_BY_ID, ALL_ACTIVITIES, CHOICE_BY_ID, CHOICE_PROMPTS, DOMAIN_META, ageInfo, type Domain } from '@/lib/activities'
import { buildDayPlan, dateKey } from '@/lib/plan'
import { loadProgress, saveProgress, type ProgressStore } from '@/lib/storage'

const DOMAINS = Object.keys(DOMAIN_META) as Domain[]

export default function ProgressPage() {
  const [today] = useState(() => new Date())
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState<ProgressStore>({})
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const todayKey = dateKey(today)

  useEffect(() => {
    setProgress(loadProgress())
    setMounted(true)
  }, [])

  function exportJson() {
    const data = {
      app: 'grow-up',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: loadProgress(),
      meta: {
        note: '小芽成长打卡数据，可重新导入',
      },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const d = new Date()
    const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    a.href = url
    a.download = `grow-up-progress-${key}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('已导出 JSON，请妥善保存备份文件')
  }

  async function importJson(file: File) {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { progress?: ProgressStore } & ProgressStore
      const next = parsed && typeof parsed === 'object' && parsed.progress ? parsed.progress : (parsed as ProgressStore)
      if (!next || typeof next !== 'object') throw new Error('bad')
      const cleaned: ProgressStore = {}
      let dropped = 0
      for (const [k, v] of Object.entries(next)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(k) && Array.isArray(v)) {
          const ids = v.filter(
            (x) => typeof x === 'string' && (ACTIVITY_BY_ID.has(x) || CHOICE_BY_ID.has(x)),
          )
          dropped += v.length - ids.length
          if (ids.length) cleaned[k] = ids
        }
      }
      const days = Object.keys(cleaned).length
      if (days === 0) {
        setMsg('导入失败：文件里没有可识别的打卡记录')
        return
      }
      if (!window.confirm(`将导入 ${days} 天记录。同一天的记录会以导入文件为准（覆盖现有数据）。继续？`)) {
        return
      }
      const merged: ProgressStore = { ...loadProgress(), ...cleaned }
      saveProgress(merged)
      setProgress(merged)
      setMsg(`已导入 ${days} 天记录${dropped > 0 ? `（跳过 ${dropped} 条无法识别的记录）` : ''}`)
    } catch {
      setMsg('导入失败：请选择本 App 导出的 JSON 文件')
    }
  }

  // 连续打卡天数：今天没打也不断，从昨天往前数
  const streak = useMemo(() => {
    let n = 0
    const d = new Date(today)
    if (!(progress[dateKey(d)] || []).length) d.setDate(d.getDate() - 1)
    while ((progress[dateKey(d)] || []).length > 0) {
      n++
      d.setDate(d.getDate() - 1)
    }
    return n
  }, [progress, today])

  // 近 14 天完成率：勾选数 / 计划档位数（只统计当天计划内的打卡）
  const rate = useMemo(() => {
    let planned = 0
    let done = 0
    for (let i = 0; i < 14; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const p = buildDayPlan(d)
      const ids = new Set([p.choice.id, ...p.slots.map((s) => s.id)])
      planned += ids.size
      done += (progress[p.dateKey] || []).filter((id) => ids.has(id)).length
    }
    return planned > 0 ? Math.round((done / planned) * 100) : 0
  }, [progress, today])

  // 近 4 周领域趋势（周一为一周起点，含本周）
  const weeks = useMemo(() => {
    const result: { label: string; counts: Record<Domain, number>; total: number }[] = []
    const base = new Date(today)
    base.setDate(base.getDate() - ((base.getDay() + 6) % 7))
    for (let w = 3; w >= 0; w--) {
      const start = new Date(base)
      start.setDate(base.getDate() - w * 7)
      const counts: Record<Domain, number> = { health: 0, language: 0, social: 0, science: 0, art: 0 }
      let total = 0
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        if (d > today) break
        for (const id of progress[dateKey(d)] || []) {
          const a = ACTIVITY_BY_ID.get(id)
          if (a) {
            counts[a.domain]++
            total++
          } else {
            const c = CHOICE_BY_ID.get(id)
            if (c) {
              counts[c.domain]++
              total++
            }
          }
        }
      }
      result.push({ label: `${start.getMonth() + 1}/${start.getDate()} 那周`, counts, total })
    }
    return result
  }, [progress, today])

  const todayDone = (progress[todayKey] || []).length
  const totalDays = Object.keys(progress).length
  const allDoneCount = Object.values(progress).reduce((s, list) => s + list.length, 0)
  const age = ageInfo(today)

  const domainHits = useMemo(() => {
    const map: Record<Domain, number> = { health: 0, language: 0, social: 0, science: 0, art: 0 }
    for (const list of Object.values(progress)) {
      for (const id of list) {
        const a = ACTIVITY_BY_ID.get(id)
        if (a) {
          map[a.domain]++
          continue
        }
        const c = CHOICE_BY_ID.get(id)
        if (c) map[c.domain]++
      }
    }
    return map
  }, [progress])

  if (!mounted) {
    return (
      <main>
        <div className="page-loading" role="status">
          正在读取成长足迹…
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="section-title">
        <h2>成长足迹</h2>
        <span className="hint">仅保存在本机浏览器</span>
      </div>

      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <div className="stat">
          <div className="num">{todayDone}</div>
          <div className="lbl">今日完成</div>
        </div>
        <div className="stat">
          <div className="num">{streak}</div>
          <div className="lbl">连续打卡 · 天</div>
        </div>
        <div className="stat">
          <div className="num">{rate}%</div>
          <div className="lbl">近 14 天完成率</div>
        </div>
        <div className="stat">
          <div className="num">{allDoneCount}</div>
          <div className="lbl">累计打卡</div>
        </div>
        <div className="stat">
          <div className="num">{totalDays}</div>
          <div className="lbl">有记录的天数</div>
        </div>
        <div className="stat">
          <div className="num" style={{ fontSize: 20, paddingTop: 4 }}>
            {age.turnedFour ? '4 岁' : `${age.daysToFour}d`}
          </div>
          <div className="lbl">{age.turnedFour ? '年龄' : '距 4 岁'}</div>
        </div>
      </div>

      <section className="glass page-block">
        <h3>近 4 周领域趋势</h3>
        <p>每周一行，颜色分段是各领域打卡占比。看趋势就好，不用追求每周平均。</p>
        {weeks.map((w) => (
          <div key={w.label} style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
              <span>{w.label}</span>
              <span style={{ color: 'var(--muted)' }}>{w.total > 0 ? `${w.total} 次` : '—'}</span>
            </div>
            <div className="ribbon-bar" style={{ marginTop: 6 }}>
              {w.total > 0 ? (
                DOMAINS.map((d) =>
                  w.counts[d] > 0 ? (
                    <span
                      key={d}
                      style={{
                        width: `${(w.counts[d] / w.total) * 100}%`,
                        background: DOMAIN_META[d].color,
                      }}
                    />
                  ) : null,
                )
              ) : (
                <span style={{ width: '100%', background: 'rgba(255,255,255,0.5)' }} />
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="glass page-block">
        <h3>数据备份（JSON）</h3>
        <p>打卡仅存在本机浏览器。换手机或清缓存前，请先导出；新设备再导入即可继续。</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={exportJson}
            style={{
              minHeight: 44,
              padding: '0 16px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, var(--pink), var(--pink-soft))',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            导出 JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              minHeight: 44,
              padding: '0 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,107,157,0.35)',
              color: 'var(--pink-deep)',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            导入 JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void importJson(f)
              e.target.value = ''
            }}
          />
        </div>
        {msg && (
          <div className="guide-tag" style={{ marginTop: 10 }}>
            {msg}
          </div>
        )}
        <p style={{ marginTop: 10, fontSize: 12 }}>
          当前数据约 <strong style={{ color: 'var(--pink)' }}>{totalDays}</strong> 天 ·
          活动库 <strong style={{ color: 'var(--pink)' }}>{ALL_ACTIVITIES.length}</strong> 条 +
          自选角 <strong style={{ color: 'var(--pink)' }}>{CHOICE_PROMPTS.length}</strong> 个方向（每日按日期自动组合，非固定日历）
        </p>
      </section>

      <section className="glass page-block">
        <h3>领域覆盖（累计）</h3>
        <p>覆盖是参考不是排名。偶尔只玩一类也没关系，长期尽量五领域都有碰到。</p>
        {DOMAINS.map((key) => {
          const m = DOMAIN_META[key]
          const n = domainHits[key] || 0
          const max = Math.max(1, ...DOMAINS.map((d) => domainHits[d]))
          return (
            <div key={key} style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                <span>
                  {m.emoji} {m.name}
                </span>
                <span style={{ color: 'var(--muted)' }}>{n} 次</span>
              </div>
              <div className="progress-bar">
                <i style={{ width: `${(n / max) * 100}%`, background: m.color }} />
              </div>
            </div>
          )
        })}
      </section>

      <section className="glass page-block">
        <h3>最近有记录的日子</h3>
        {totalDays === 0 ? (
          <div className="empty">还没有打卡。今天任意完成一项，就会出现在这里。</div>
        ) : (
          Object.keys(progress)
            .sort()
            .slice(-14)
            .reverse()
            .map((k) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{k}</span>
                <span style={{ color: 'var(--pink)', fontFamily: 'ui-monospace, SF Mono, Menlo, monospace', fontWeight: 700 }}>
                  {progress[k].length} 项
                </span>
              </div>
            ))
        )}
      </section>

      <section className="glass page-block">
        <h3>给家长的一句话</h3>
        <p>
          目标不是“学了多少字”，而是她更愿意表达、更敢尝试、更会想办法。
          若她胆小、受欺负不敢说：先共情，再一起练“说停—走开—告诉老师”。
          她可以喜欢爬树、也可以喜欢公主裙；可以文静，也可以大声维护自己——两件事都对。
        </p>
      </section>
    </main>
  )
}
