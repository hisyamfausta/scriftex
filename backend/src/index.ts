import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { listDocuments, getDocument, createDocument, updateDocument, deleteDocument } from './db.js'

const latexUrl = process.env.LATEX_SERVICE_URL || 'http://localhost:4000'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.get('/api/documents', (c) => c.json(listDocuments()))
app.post('/api/documents', (c) => c.json(createDocument(), 201))
app.get('/api/documents/:id', (c) => {
  const document = getDocument(c.req.param('id'))
  return document ? c.json(document) : c.json({ error: 'not found' }, 404)
})
app.put('/api/documents/:id', async (c) => {
  const body = await c.req.json()
  const document = updateDocument(c.req.param('id'), body)
  return document ? c.json(document) : c.json({ error: 'not found' }, 404)
})
app.delete('/api/documents/:id', (c) => {
  const ok = deleteDocument(c.req.param('id'))
  return ok ? c.newResponse(null, 204) : c.json({ error: 'not found' }, 404)
})

app.post('/api/compile', async (c) => {
  const source = await c.req.text()
  try {
    const response = await fetch(`${latexUrl}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: source,
    })
    if (!response.ok) {
      const errorText = await response.text()
      return c.json({ error: errorText }, 400)
    }
    const pdf = await response.arrayBuffer()
    return c.body(pdf, 200, { 'Content-Type': 'application/pdf' })
  } catch (error) {
    return c.json({ error: 'Compilation service unavailable' }, 503)
  }
})

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Backend running on :${info.port}`)
})
