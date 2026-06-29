import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { execSync } from 'child_process'
import { writeFileSync, readFileSync, mkdtempSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.post('/compile', async (c) => {
  const source = await c.req.text()
  const directory = mkdtempSync(join(tmpdir(), 'latex-'))

  try {
    writeFileSync(join(directory, 'input.tex'), source, 'utf-8')

    let log = ''
    for (let pass = 0; pass < 2; pass++) {
      try {
        execSync('pdflatex -interaction=nonstopmode -halt-on-error input.tex', {
          cwd: directory,
          timeout: 30000,
          stdio: ['pipe', 'pipe', 'pipe'],
        })
      } catch (error: any) {
        log = error.stderr?.toString() || error.stdout?.toString() || error.message
      }
    }

    const pdfPath = join(directory, 'input.pdf')
    if (existsSync(pdfPath)) {
      const pdf = readFileSync(pdfPath)
      return c.body(pdf, 200, { 'Content-Type': 'application/pdf' })
    }

    const logPath = join(directory, 'input.log')
    if (existsSync(logPath)) {
      const fullLog = readFileSync(logPath, 'utf-8')
      const errors = extractErrors(fullLog) || fullLog
      return c.json({ error: errors }, 400)
    }

    return c.json({ error: log || 'Compilation failed with no output' }, 400)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

function extractErrors(log: string): string {
  const lines = log.split('\n')
  const errorLines: string[] = []
  let inError = false
  for (const line of lines) {
    if (line.startsWith('! ')) {
      inError = true
      errorLines.push(line)
    } else if (inError) {
      if (line.startsWith('l.') || line.match(/^\s+\d+\s+/)) {
        errorLines.push(line)
      } else if (line.trim() === '') {
        inError = false
      } else {
        errorLines.push(line)
      }
    }
  }
  return errorLines.join('\n')
}

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`LaTeX service running on :${info.port}`)
})
