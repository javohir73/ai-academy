import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'coverage', '.vercel', '.netlify'])
const skipFiles = new Set(['package-lock.json'])
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml',
])

const patterns = [
  { name: 'AWS access key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Google API key', regex: /AIza[0-9A-Za-z_-]{35}/g },
  { name: 'GitHub classic token', regex: /ghp_[0-9A-Za-z_]{36,}/g },
  { name: 'GitHub fine-grained token', regex: /github_pat_[0-9A-Za-z_]{80,}/g },
  { name: 'OpenAI API key', regex: /sk-[A-Za-z0-9_-]{20,}/g },
  { name: 'Slack token', regex: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
  { name: 'Private key block', regex: /BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY/g },
  { name: 'npm auth token', regex: /\/\/registry\.npmjs\.org\/:_authToken=/g },
]

function shouldRead(file) {
  const base = path.basename(file)
  if (skipFiles.has(base)) return false
  if (base.startsWith('.env') && base !== '.env.example') return true
  return textExtensions.has(path.extname(file))
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) yield* walk(path.join(dir, entry.name))
      continue
    }
    if (entry.isFile()) yield path.join(dir, entry.name)
  }
}

const findings = []

for await (const file of walk(root)) {
  if (!shouldRead(file)) continue
  const rel = path.relative(root, file)
  const info = await stat(file)
  if (info.size > 1024 * 1024) continue

  if (path.basename(file).startsWith('.env') && path.basename(file) !== '.env.example') {
    findings.push(`${rel}: environment file should not be committed`)
  }

  const text = await readFile(file, 'utf8')
  const lines = text.split(/\r?\n/)
  for (const { name, regex } of patterns) {
    regex.lastIndex = 0
    let match
    while ((match = regex.exec(text))) {
      const line = text.slice(0, match.index).split(/\r?\n/).length
      const preview = lines[line - 1].replace(match[0], '[REDACTED]').trim()
      findings.push(`${rel}:${line}: possible ${name}: ${preview}`)
    }
  }
}

if (findings.length) {
  console.error('Potential secrets found:')
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.log('No high-confidence secrets found.')
