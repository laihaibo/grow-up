// 从 app/icon.svg 生成全套位图图标 + OG 分享卡。
// 用法: node scripts/generate-icons.mjs  （需要 devDependency: sharp）
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'app', 'icon.svg'))

const out = async (size, file, opts = {}) => {
  await sharp(svg, { density: Math.max(96, (size / 64) * 96 * 2) })
    .resize(size, size)
    .png(opts)
    .toFile(join(root, file))
  console.log('✓', file, `${size}x${size}`)
}

// —— 应用图标 ——
await out(16, 'public/favicon-16.png')
await out(32, 'public/favicon-32.png')
await out(192, 'public/icon-192.png')
await out(512, 'public/icon-512.png', { compressionLevel: 9 })
await out(180, 'public/apple-touch-icon.png') // Apple 自行圆角，保持方形
await out(512, 'app/icon.png', { compressionLevel: 9 })

// —— OG 分享卡（1200×630）——
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF3F8"/>
      <stop offset="1" stop-color="#F3D6E7"/>
    </linearGradient>
    <radialGradient id="wash1" cx="0.12" cy="0.05" r="0.7">
      <stop offset="0" stop-color="#FF2D95" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#FF2D95" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="wash2" cx="0.9" cy="0.95" r="0.7">
      <stop offset="0" stop-color="#A78BFA" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#A78BFA" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#wash1)"/>
  <rect width="1200" height="630" fill="url(#wash2)"/>
  <rect x="430" y="105" width="340" height="340" rx="76" fill="#FFFFFF" opacity="0.6"/>
  <rect x="430" y="105" width="340" height="340" rx="76" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.9"/>
  <g transform="translate(460 135)">
    <svg width="280" height="280" viewBox="0 0 64 64">${svg.toString('utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>
  </g>
  <text x="600" y="540" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, Noto Sans SC, sans-serif" font-size="64" font-weight="700" fill="#2B1B24">小芽成长</text>
  <text x="600" y="588" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, Noto Sans SC, sans-serif" font-size="28" font-weight="500" fill="#8A6B7A">每天一份亲子成长计划</text>
</svg>`

// 供下一步复用（也落盘一份便于人工检查）
writeFileSync(join(root, '.og-src.svg'), ogSvg)
await sharp(Buffer.from(ogSvg)).png().toFile(join(root, 'public', 'og.png'))
console.log('✓ public/og.png 1200x630')
