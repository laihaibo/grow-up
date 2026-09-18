import { cp, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const out = join(root, '..', 'out')
const dest = join(root, '..')

await cp(join(out, 'index.html'), join(dest, 'index.html'))
console.log('phone simulator index.html ready (standalone app already at project root)')
