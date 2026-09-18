'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ageInfo } from '@/lib/activities'

const tabs = [
  { href: '/', label: '今日', ico: '🌸' },
  { href: '/domains/', label: '领域', ico: '🧩' },
  { href: '/stories/', label: '故事', ico: '👮‍♀️' },
  { href: '/progress/', label: '成长', ico: '💗' },
]

function normalize(path: string) {
  let p = path || '/'
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  if (basePath && p.startsWith(basePath)) {
    p = p.slice(basePath.length) || '/'
  }
  if (!p.startsWith('/')) p = `/${p}`
  return p.endsWith('/') ? p : `${p}/`
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const age = ageInfo(new Date())
  const current = normalize(pathname || '/')

  return (
    <div className="app">
      <header className="glass glass-header">
        <div className="brand">
          <div className="brand-kicker">3–6 岁成长指南</div>
          <h1 className="brand-title">小芽成长</h1>
        </div>
        <div className="age-badge">
          <div className="days">
            {age.turnedFour ? '已满 4 岁 🎂' : `距 4 岁 · ${age.daysToFour} 天`}
          </div>
          <div className="meta">{age.displayAge}</div>
        </div>
      </header>

      {children}

      <nav className="glass tabbar" aria-label="主导航">
        {tabs.map((t) => {
          const active = current === normalize(t.href)
          // Next.js Link applies next.config basePath — do not prefix again
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`tab${active ? ' active' : ''}`}
              prefetch={false}
            >
              <span className="ico" aria-hidden>
                {t.ico}
              </span>
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
