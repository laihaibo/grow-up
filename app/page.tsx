'use client'

import { useEffect, useMemo, useState } from 'react'
import { DOMAIN_META, FOCUS_META, PRIORITY_FOCUS } from '@/lib/activities'
import { buildDayPlan, type PlanSlot } from '@/lib/plan'
import { isDone, loadProgress, toggleActivity, type ProgressStore } from '@/lib/storage'

export default function TodayPage() {
  const plan = useMemo(() => buildDayPlan(new Date()), [])
  const [progress, setProgress] = useState<ProgressStore>({})
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const doneCount = plan.slots.filter((s) => isDone(progress, plan.dateKey, s.id)).length + (isDone(progress, plan.dateKey, plan.choice.id) ? 1 : 0)
  const total = plan.slots.length + 1
  const pct = Math.round((doneCount / total) * 100)

  function onToggle(id: string) {
    setProgress(toggleActivity(plan.dateKey, id))
  }

  return (
    <main>
      <div className="date-row">
        <span className="wd">{plan.weekdayLabel}</span>
        <span className="full">{plan.dateLabel} · {plan.isWeekend ? '周末长时段' : '工作日 1.5 小时'}</span>
      </div>

      <section className="glass ribbon" aria-label="今日时间安排">
        <div className="ribbon-top">
          <div>
            <h2>今日时间花环</h2>
            <div className="ribbon-pills" style={{ marginTop: 10 }}>
              {plan.domainMinutes
                .filter((d) => d.minutes > 0)
                .map((d) => (
                  <span className="pill" key={d.domain}>
                    <span className="orb" style={{ background: d.color }} />
                    {d.name}
                    <span className="min">{d.minutes}′</span>
                  </span>
                ))}
            </div>
          </div>
          <div className="budget">
            {plan.plannedMinutes}
            <span style={{ fontSize: 13, color: 'var(--muted)' }}> / {plan.budgetMinutes} 分</span>
          </div>
        </div>
        <div className="ribbon-bar" aria-hidden>
          {plan.domainMinutes.map((d) =>
            d.minutes > 0 ? (
              <span
                key={d.domain}
                style={{
                  width: `${(d.minutes / Math.max(plan.plannedMinutes, 1)) * 100}%`,
                  background: d.color,
                }}
              />
            ) : null,
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
          已完成 {doneCount}/{plan.slots.length + 1} · 汉字/英语/数学/逻辑 + 勇敢表达 + 自选
        </div>
        <div className="progress-bar" aria-hidden>
          <i style={{ width: `${pct}%` }} />
        </div>
      </section>

      {plan.braveFocus && (
        <section
          className="glass page-block"
          style={{
            marginBottom: 16,
            borderColor: 'rgba(255,45,149,0.3)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,107,157,0.12))',
          }}
        >
          <h3 style={{ color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', gap: 8 }}>
            💪 今日勇气练习 · {plan.braveFocus.title}
          </h3>
          <p>{plan.braveFocus.hint}</p>
          <div className="guide-tag">家里先练：说“停” → 走开 → 告诉老师/家长</div>
        </section>
      )}

      <div className="section-title">
        <h2>今日活动</h2>
        <span className="hint">点开看步骤 · 圆圈打卡</span>
      </div>

      <div className="cards">
        {plan.slots.map((slot) => (
          <ActivityCard
            key={slot.id}
            slot={slot}
            done={isDone(progress, plan.dateKey, slot.id)}
            open={openId === slot.id}
            onOpen={() => setOpenId(openId === slot.id ? null : slot.id)}
            onToggle={() => onToggle(slot.id)}
          />
        ))}

        <article className="glass card">
          <div className="card-head">
            <div className="orb-lg" style={{ ['--orb-color' as string]: 'var(--pink-soft)' }}>
              <span>🫧</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">自选角 · {plan.choice.label}</h3>
              <div className="card-meta">
                <span className="chip focus">她来决定</span>
                <span className="chip">约 {plan.choice.minutes} 分钟</span>
              </div>
              <p className="card-guide">
                没有“男孩游戏 / 女孩游戏”。运动、搭建、科学、故事、创作、当队长——想试哪个就试哪个。
                今天可以试：{plan.choice.hint}
              </p>
              <ul className="card-steps" style={{ display: 'flex' }}>
                <li>问：“你今天最想玩哪一种？”</li>
                <li>让她先选方向，家长只配合不改主意</li>
                <li>过程中问：“你发现了什么？”而不是教标准答案</li>
              </ul>
            </div>
          </div>
          <div className="card-foot">
            <div className="card-tip">选择本身就是成长：练习表达意愿、承担结果。</div>
            <button
              type="button"
              className={`check${isDone(progress, plan.dateKey, plan.choice.id) ? ' on' : ''}`}
              aria-pressed={isDone(progress, plan.dateKey, plan.choice.id)}
              aria-label="自选角打卡"
              onClick={() => onToggle(plan.choice.id)}
            >
              ✓
            </button>
          </div>
        </article>
      </div>
    </main>
  )
}

function ActivityCard({
  slot,
  done,
  open,
  onOpen,
  onToggle,
}: {
  slot: PlanSlot
  done: boolean
  open: boolean
  onOpen: () => void
  onToggle: () => void
}) {
  const meta = DOMAIN_META[slot.domain]
  const focusChips = slot.focus.slice(0, 4).map((f) => FOCUS_META[f])
  const hasPriority = slot.focus.some((f) => (PRIORITY_FOCUS as string[]).includes(f))

  return (
    <article className={`glass card${open ? ' open' : ''}${done ? ' done' : ''}`}>
      <div className="card-head" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
        <div className="orb-lg" style={{ ['--orb-color' as string]: meta.color }}>
          <span>{meta.emoji}</span>
        </div>
        <div className="card-body">
          <h3 className="card-title">{slot.title}</h3>
          <div className="card-meta">
            <span className="chip" style={{ color: meta.color }}>
              {meta.name} · {slot.minutes} 分钟
            </span>
            {focusChips.map((c) => (
              <span key={c.short} className="chip">
                {c.short}
              </span>
            ))}
            {hasPriority && <span className="chip focus">重点</span>}
          </div>
          {slot.guide && <p className="card-guide">《指南》：{slot.guide}</p>}
        </div>
      </div>

      <ul className="card-steps">
        {slot.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
        {slot.materials && <li style={{ counterIncrement: 'none' }}>材料：{slot.materials}</li>}
      </ul>

      <div className="card-foot">
        <div className="card-tip">{slot.tip || '轻松玩就好，过程比结果重要。'}</div>
        <button
          type="button"
          className={`check${done ? ' on' : ''}`}
          aria-pressed={done}
          aria-label={done ? '取消打卡' : '完成打卡'}
          onClick={onToggle}
        >
          ✓
        </button>
      </div>
    </article>
  )
}
