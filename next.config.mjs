/** @type {import('next').NextConfig} */
const repo = 'grow-up'
const isCI = process.env.GITHUB_ACTIONS === 'true'
const basePath = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : isCI ? `/${repo}` : ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
