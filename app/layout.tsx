import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppShell } from './components/AppShell'

export const metadata: Metadata = {
  title: '小芽成长',
  description: '基于《3-6岁儿童学习与发展指南》的每日亲子活动计划',
  applicationName: '小芽成长',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#F9EAF2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
