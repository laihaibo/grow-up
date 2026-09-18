/** @type {import('next').NextConfig} */
const repo = 'grow-up'
const isCI = process.env.GITHUB_ACTIONS === 'true'
const basePath = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : isCI ? `/${repo}` : ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath alone is enough for GH Pages project site; do NOT also set assetPrefix
  // (assetPrefix + basePath can double-prefix /_next and break tabs/assets)
  basePath: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
