'use client'

import { useEffect, useMemo, useState } from 'react'
import { DOMAIN_META } from '@/lib/activities'
import { coachFor } from '@/lib/coach'
import {
  CHILD_NAME,
  CLASS_NAME,
  DRILL_DATE,
  MISSION_DAYS,
  SPEECH,
  SPEECH_FULL,
  daysUntilDrill,
  isMissionWindow,
  missionForDate,
} from '@/lib/mission'
import { getActivity } from '@/lib/activities'
import { dateKey } from '@/lib/plan'
import { isDone, loadProgress, toggleActivity, type ProgressStore } from '@/lib/storage'
import Link from 'next/link'

export default function MissionPage() {
  const today = useMemo(() => new Date(), [])
  const todayKey = dateKey(today)
  const todayMission = missionForDate(today)
  const inWindow = isMissionWindow(today)
  const dLeft = daysUntilDrill(today)
  const [progress, setProgress] = useState<ProgressStore>({})
  const [openId, setOpenId] = useState<string | null>(todayMission?.activityId ?? null)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const doneCount = MISSION_DAYS.filter((d) => isDone(progress, d.dateKey, d.activityId)).length
  const pct = Math.round((doneCount / MISSION_DAYS.length) * 100)

  function onToggle(dayKey: string, activityId: string) {
    setProgress(toggleActivity(dayKey, activityId))
  }

  return (
    <main>
      <div className="date-row">
        <span className="wd">演练任务</span>
        <span className="full">
          {CLASS_NAME} · {CHILD_NAME} · 演习日 {DRILL_DATE.getMonth() + 1} 月 {DRILL_DATE.getDate()} 日
        </span>
      </div>

      <section
        className="glass page-block"
        style={{
          borderColor: 'rgba(255,45,149,0.28)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.74), rgba(255,107,157,0.14))',
        }}
      >
        <h3 style={{ color: 'var(--pink-deep)' }}>👮 防诱拐演习 · 小小见习警员</h3>
        <p>
          {inWindow
            ? dLeft === 0
              ? '今天就是演习日。完整说一遍就是胜利，卡壳也没关系。'
              : `距演习还有 ${dLeft} 天。今日任务：${todayMission?.title ?? '休整'}`
            : '窗口外可随时复盘口令；正式练习日为演习前 3 天。'}
        </p>
        <div className="guide-tag">
          游戏框架：黑猫警长见习任务 · 不是考试 · 告诉大人不是告状，是保护自己
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="progress-bar" aria-hidden>
            <i style={{ width: `${pct}%` }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
            四日任务打卡 {doneCount}/{MISSION_DAYS.length}
          </div>
        </div>
      </section>

      <div className="section-title">
        <h2>背诵原文</h2>
        <span className="hint">幼儿园稿 · 逐字练习</span>
      </div>
      <section className="glass page-block">
        <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
          {SPEECH.map((line, i) => (
            <li key={line.id}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>
                {i + 1}. {line.label}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.55 }}>{line.text}</div>
            </li>
          ))}
        </ol>
        <div className="guide-tag" style={{ marginTop: 12 }}>
          完整连读：{SPEECH_FULL}
        </div>
      </section>

      <div className="section-title">
        <h2>逐日日程</h2>
        <span className="hint">角色扮演 · 话术可展开</span>
      </div>

      <div className="cards">
        {MISSION_DAYS.map((day) => {
          const activity = getActivity(day.activityId)
          const coach = activity?.coach || coachFor(day.activityId)
          const done = isDone(progress, day.dateKey, day.activityId)
          const isToday = day.dateKey === todayKey
          const open = openId === day.activityId
          const meta = DOMAIN_META[activity?.domain ?? 'social']
          return (
            <article
              key={day.dateKey}
              className={`glass card${open ? ' open' : ''}${done ? ' done' : ''}`}
              style={
                isToday
                  ? { borderColor: 'rgba(255,45,149,0.45)' }
                  : undefined
              }
            >
              <div
                className="card-head"
                onClick={() => setOpenId(open ? null : day.activityId)}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpenId(open ? null : day.activityId)
                  }
                }}
              >
                <div className="orb-lg" style={{ ['--orb-color' as string]: meta.color }}>
                  <span>{isToday ? '⭐' : meta.emoji}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">
                    {day.offsetLabel} · {day.title}
                  </h3>
                  <div className="card-meta">
                    <span className="chip">
                      {day.weekdayLabel} {day.dateKey.slice(5)} · {activity?.minutes ?? 12} 分钟
                    </span>
                    {isToday && <span className="chip focus">今日</span>}
                    <span className="chip focus">{open ? '收起跟练' : '展开跟练'}</span>
                  </div>
                  <p className="card-guide">
                    {day.theme}。{day.brief}
                  </p>
                </div>
              </div>

              {open && coach && (
                <ul className="card-steps open-list">
                  <li className="coach-setup">
                    <strong>准备</strong>
                    {coach.setup}
                  </li>
                  {coach.script.map((line, i) => (
                    <li key={`${day.activityId}-s-${i}`}>
                      <strong>跟练 {i + 1}</strong>
                      {line}
                    </li>
                  ))}
                  <li>
                    <strong>观察点</strong>
                    {coach.watch}
                  </li>
                  <li>
                    <strong>不想做时</strong>
                    {coach.ifStuck}
                  </li>
                  {coach.bonus && (
                    <li>
                      <strong>加分挑战</strong>
                      {coach.bonus}
                    </li>
                  )}
                </ul>
              )}

              <div className="card-foot">
                <div className="card-tip">任务 id：{day.activityId}</div>
                <button
                  type="button"
                  className={`check${done ? ' on' : ''}`}
                  aria-pressed={done}
                  aria-label={done ? '取消打卡' : '完成打卡'}
                  onClick={() => onToggle(day.dateKey, day.activityId)}
                >
                  ✓
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <section className="glass page-block" style={{ marginTop: 8 }}>
        <h3>家长提示</h3>
        <p>
          每天只玩一条任务；完整背诵放在演习日彩排。孩子害怕时先抱一下，再说「我们慢慢练」。
          产品里的「勇敢表达」系列可并行，但不要叠成刷题。
        </p>
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/" className="guide-tag">
            回到今日计划
          </Link>
          <Link href="/stories/" className="guide-tag">
            睡前警长故事
          </Link>
        </div>
      </section>
    </main>
  )
}
