import { DOMAIN_META, PRIORITY_FOCUS, FOCUS_META } from '@/lib/activities'

const guidePoints: Record<string, string[]> = {
  health: [
    '3–4 岁：能沿地面直线或低矮物体行走；双脚交替上下楼梯；能用勺子吃饭',
    '4–4.5 岁：能快跑 20 米左右；能单脚站立 5 秒左右；尝试自己穿脱简单衣物',
    '重点：动作协调 + 生活自理 + 情绪稳定，不必追求“像谁一样文静/好动”',
  ],
  language: [
    '3–4 岁：愿意在熟悉的人面前说话；能口齿清楚地说儿歌、童谣；会看画面讲故事',
    '4–4.5 岁：能基本完整地讲述自己的所见所闻；对文字符号开始感兴趣',
    '重点：先听说、再读认；汉字与英语都是“表达工具”，不要求抄写',
  ],
  social: [
    '3–4 岁：愿意和小朋友一起游戏；在提醒下能遵守规则；爱父母长辈',
    '4–4.5 岁：喜欢和小朋友一起游戏；学习轮流、分享；会主动打招呼',
    '重点：练习选择、协商与边界，而不是“听话就行”',
  ],
  science: [
    '3–4 岁：感知常见动植物；感知物体软硬、大小、多少；对形状感兴趣',
    '4–4.5 岁：能感知 10 以内数量；能发现简单规律；喜欢提问并动手验证',
    '重点：数学与逻辑在游戏中发生；建构、机械、测量对任何孩子都开放',
  ],
  art: [
    '3–4 岁：喜欢听音乐、唱唱跳跳；能用涂涂画画表达；喜欢玩彩泥、撕贴',
    '4–4.5 岁：能用多种方式表现自己的感受；愿意展示作品',
    '重点：创作没有“男孩风格女孩风格”，大胆用色、大胆动手都值得鼓励',
  ],
}

const priorityNotes: Record<string, string> = {
  hanzi: '生活场景认字：包装、门牌、绘本；玩卡片与寻宝，不要求书写量',
  english: '听说先行：儿歌、颜色、动物、数字；允许沉默观察期',
  math: '手口一致点数、比较多少长短、玩规律与形状',
  logic: '分类、排序、找不同、简单迷宫、因果讨论',
}

export default function DomainsPage() {
  return (
    <main>
      <section className="glass page-block" style={{ borderColor: 'rgba(255,45,149,0.25)' }}>
        <h3 style={{ color: 'var(--pink-deep)' }}>不设限的成长</h3>
        <p>
          粉色只是界面颜色，不是内容边界。运动、搭建、科学实验、迷宫、当队长、弄脏手的沙土探索——
          和读绘本、认汉字、唱歌画画同样重要。每天有一角由<strong style={{ color: 'var(--ink)' }}>她自己选</strong>。
        </p>
        <div className="guide-tag">原则：想试什么就试什么 · 家长是玩伴不是裁判</div>
      </section>

      <section className="glass page-block" style={{ borderColor: 'rgba(255,45,149,0.35)' }}>
        <h3 style={{ color: 'var(--pink-deep)' }}>💪 本期成长重点：勇敢表达</h3>
        <p>
          若她偏胆小、被欺负时不敢反抗或不敢告诉老师，请把「说清楚 + 会求助」当成和认字一样重要的能力来练。
          核心口诀（每天可重复）：
        </p>
        <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
          <li>① 大声说：<strong style={{ color: 'var(--ink)' }}>停！我不喜欢这样。</strong></li>
          <li>② 离开现场，保护身体，不硬拼。</li>
          <li>③ <strong style={{ color: 'var(--ink)' }}>告诉老师或家长</strong>——这不是告状，是求助。</li>
          <li>④ 家里永远相信她、和她一起想办法，不先批评她“怎么不打回去”。</li>
        </ul>
        <div className="guide-tag">今日页会有勇气练习 · 领域页与活动库已内置 brave 系列</div>
      </section>

      <div className="section-title">
        <h2>五大领域</h2>
        <span className="hint">对照《3-6岁指南》</span>
      </div>

      <div className="domain-grid">
        {(Object.keys(DOMAIN_META) as Array<keyof typeof DOMAIN_META>).map((key) => {
          const m = DOMAIN_META[key]
          return (
            <section key={key} className="glass page-block">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div className="orb-lg" style={{ ['--orb-color' as string]: m.color }}>
                  {m.emoji}
                </div>
                <div>
                  <h3 style={{ color: m.color }}>{m.name}</h3>
                  <p style={{ fontSize: 12 }}>{m.guideLine}</p>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', fontSize: 13, lineHeight: 1.55 }}>
                {guidePoints[key].map((line) => (
                  <li key={line} style={{ marginBottom: 4 }}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="section-title" style={{ marginTop: 8 }}>
        <h2>本期重点方向</h2>
        <span className="hint">融入活动，不单独鸡娃</span>
      </div>

      <section className="glass page-block">
        {PRIORITY_FOCUS.map((f) => (
          <div key={f} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--pink-deep)', marginBottom: 4 }}>
              {FOCUS_META[f].name} <span className="chip focus">{FOCUS_META[f].short}</span>
            </div>
            <p>{priorityNotes[f]}</p>
          </div>
        ))}
        <p style={{ marginTop: 4 }}>
          这些<strong style={{ color: 'var(--ink)' }}>不是全部</strong>。指南五领域同等重要；重点方向只保证每天“有碰到”，
          其余时间留给健康、社会、艺术与自由探索。
        </p>
      </section>
    </main>
  )
}
