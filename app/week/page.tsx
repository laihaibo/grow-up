'use client'

import { useMemo } from 'react'
import { buildWeekPreview } from '@/lib/plan'

export default function WeekPage() {
  const week = useMemo(() => buildWeekPreview(new Date()), [])

  return (
    <main>
      <div className="section-title">
        <h2>本周节律</h2>
        <span className="hint">工作日约 90 分 · 周末约 300 分</span>
      </div>

      <section className="glass page-block">
        <h3>节奏说明</h3>
        <p>
          周一到周五：短而稳，穿插汉字/英语/数学/逻辑，并保留<strong>自选角</strong>。
          周末：户外、实验、建构、剧场等更长的开放探索，同样由孩子参与做计划。
        </p>
      </section>

      {week.map((d) => (
        <section key={d.dateKey} className="glass week-day">
          <div className="row">
            <div className="day">
              {d.weekdayLabel}
              <span style={{ marginLeft: 8, fontWeight: 500, color: 'var(--muted)', fontSize: 12 }}>
                {d.dateLabel.slice(5)}
              </span>
            </div>
            <div className="mins">
              {d.plannedMinutes}′ {d.isWeekend ? '· 周末' : ''}
            </div>
          </div>
          <div className="ribbon-bar" style={{ height: 8, marginTop: 0, marginBottom: 10 }}>
            {d.domainMinutes.map((dm) =>
              dm.minutes > 0 ? (
                <span key={dm.domain} style={{ width: `${(dm.minutes / Math.max(d.plannedMinutes, 1)) * 100}%`, background: dm.color }} />
              ) : null,
            )}
          </div>
          <div className="week-titles">
            {d.slots.map((s) => s.title).join(' · ')}
            <div style={{ marginTop: 4, color: 'var(--pink-deep)', fontWeight: 600 }}>🫧 自选：{d.choice.label}</div>
          </div>
        </section>
      ))}
    </main>
  )
}
