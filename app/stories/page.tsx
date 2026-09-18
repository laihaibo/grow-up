'use client'

import { useState } from 'react'
import { PARENT_TIPS, STORY_PROMPTS } from '@/lib/stories'

export default function StoriesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1600)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1600)
    }
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
        {STORY_PROMPTS.map((s) => (
          <article key={s.id} className="glass card open">
            <div className="card-head">
              <div className="orb-lg" style={{ ['--orb-color' as string]: '#FF6B9D' }}>
                <span>👮‍♀️</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{s.title}</h3>
                <div className="card-meta">
                  <span className="chip" style={{ color: 'var(--pink)' }}>
                    {s.minutes}
                  </span>
                  {s.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
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
              <div className="card-tip">{copiedId === s.id ? '已复制，去聊天框粘贴吧' : '复制后发给豆包/元宝/千问即可'}</div>
              <button
                type="button"
                className="check on"
                style={{ width: 'auto', minWidth: 44, padding: '0 14px', borderRadius: 999, fontSize: 13 }}
                onClick={() => copy(s.prompt, s.id)}
              >
                {copiedId === s.id ? '✓ 已复制' : '复制'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
