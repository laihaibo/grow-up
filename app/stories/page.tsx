'use client'

import { useEffect, useRef, useState } from 'react'
import { PARENT_TIPS, STORY_PROMPTS } from '@/lib/stories'
import { isStoryTold, loadStoryTold, toggleStoryTold, type StoryToldStore } from '@/lib/storage'

/** 距 1970-01-01 的天数，用于“今晚精选”按日轮换 */
function dayNumber(d: Date) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
}

export default function StoriesPage() {
  const [today] = useState(() => new Date())
  const [mounted, setMounted] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [failedId, setFailedId] = useState<string | null>(null)
  const [told, setTold] = useState<StoryToldStore>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setTold(loadStoryTold())
    setMounted(true)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  // 今晚精选：按日轮换，挂载后再计算避免静态导出固化构建日结果
  const pick = STORY_PROMPTS[dayNumber(today) % STORY_PROMPTS.length]
  const ordered = mounted
    ? [pick, ...STORY_PROMPTS.filter((s) => s.id !== pick.id)]
    : STORY_PROMPTS

  function copy(text: string, id: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setFailedId(null)
        setCopiedId(id)
        if (timerRef.current) window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setCopiedId(null), 1600)
      })
      .catch(() => {
        setCopiedId(null)
        setFailedId(id)
      })
  }

  function onToggleTold(id: string) {
    setTold(toggleStoryTold(id, `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`))
  }

  return (
    <main>
      <div className="section-title">
        <h2>睡前故事提示词</h2>
        <span className="hint">豆包 / 元宝 / 千问</span>
      </div>

      <section className="glass page-block" style={{ borderColor: 'rgba(255,45,149,0.3)' }}>
        <h3 style={{ color: 'var(--pink-deep)' }}>给家长</h3>
        <p>
          女儿想当警察，喜欢黑猫警长，爱长故事和互动故事。下面提示词可直接粘贴到聊天框；
          AI 会边讲边问，像互动广播剧。重点方向：安全感、勇敢说清楚、会求助、合作与善良。
        </p>
        <ul>
          {PARENT_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <div className="cards">
        {ordered.map((s) => {
          const isPick = mounted && s.id === pick.id
          const open = isPick || openId === s.id
          const toldCount = (told[s.id] || []).length
          return (
            <article key={s.id} className={`glass card${open ? ' open' : ''}`}>
              <div
                className="card-head"
                onClick={() => setOpenId(open && !isPick ? null : s.id)}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpenId(open && !isPick ? null : s.id)
                  }
                }}
              >
                <div className="orb-lg" style={{ ['--orb-color' as string]: '#FF6B9D' }}>
                  <span>👮‍♀️</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{s.title}</h3>
                  <div className="card-meta">
                    {isPick && <span className="chip focus">🌙 今晚精选</span>}
                    <span className="chip" style={{ color: 'var(--pink)' }}>
                      {s.minutes}
                    </span>
                    {s.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                    {toldCount > 0 && <span className="chip told-chip">讲过 · {toldCount}</span>}
                  </div>
                  <p className="card-guide">{s.scene}</p>
                </div>
              </div>
              <ul className="card-steps">
                <li style={{ counterIncrement: 'none', whiteSpace: 'pre-wrap' }}>
                  <strong style={{ color: 'var(--pink-deep)' }}>提示词（可复制）</strong>
                  {'\n\n'}
                  {s.prompt}
                </li>
                <li style={{ counterIncrement: 'none' }}>家长提示：{s.parentNote}</li>
              </ul>
              <div className="card-foot">
                <div className="card-tip">
                  {copiedId === s.id
                    ? '已复制，去聊天框粘贴吧'
                    : failedId === s.id
                      ? '复制失败，长按提示词文字手动复制'
                      : '复制后发给豆包/元宝/千问即可'}
                </div>
                <div className="card-actions">
                  <button
                    type="button"
                    className={`swap-btn${toldCount > 0 ? ' told-on' : ''}`}
                    aria-pressed={toldCount > 0}
                    aria-label={toldCount > 0 ? `取消「${s.title}」的讲过标记` : `标记「${s.title}」已讲过`}
                    onClick={() => onToggleTold(s.id)}
                  >
                    {toldCount > 0 ? '🌙 已讲' : '讲过'}
                  </button>
                  <button
                    type="button"
                    className="check on"
                    style={{ width: 'auto', minWidth: 44, padding: '0 14px', borderRadius: 999, fontSize: 13 }}
                    aria-label={`复制「${s.title}」的提示词`}
                    onClick={() => copy(s.prompt, s.id)}
                  >
                    {copiedId === s.id ? '✓ 已复制' : '复制'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
