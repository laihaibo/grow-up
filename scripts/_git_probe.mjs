import { execFileSync } from 'node:child_process'
const git = 'C:\\Program Files\\Git\\cmd\\git.exe'
const repo = 'D:\\XiaomiMiMoProjects\\grow-up'
const args = process.argv.slice(2)
try {
  const out = execFileSync(git, ['-C', repo, ...args], { encoding: 'utf8' })
  process.stdout.write(out)
} catch (e) {
  process.stderr.write(String(e.stderr || e.message || e))
  process.exit(e.status || 1)
}
