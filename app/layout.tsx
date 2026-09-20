import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppShell } from './components/AppShell'

/** metadata.icons 不会自动加 basePath，静态导出到 GH Pages 时必须手动前缀 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const iconUrl = (path: string) => `${basePath}${path}`

export const metadata: Metadata = {
  title: '小芽成长',
  description: '基于《3-6岁儿童学习与发展指南》的每日亲子活动计划',
  applicationName: '小芽成长',
  icons: {
    icon: [
      { url: iconUrl('/favicon.svg'), type: 'image/svg+xml' },
      { url: iconUrl('/favicon-32.png'), type: 'image/png', sizes: '32x32' },
      { url: iconUrl('/icon-192.png'), type: 'image/png', sizes: '192x192' },
      { url: iconUrl('/icon-512.png'), type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: iconUrl('/apple-touch-icon.png') }],
  },
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
