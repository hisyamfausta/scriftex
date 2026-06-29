import { Hono } from 'hono'
import type { DocumentRepository } from '../data/repository/DocumentRepository.js'

export function createDocumentController(
  repo: DocumentRepository,
  latexUrl: string,
): Hono {
  const app = new Hono()

  app.get('/api/templates', (c) =>
    c.json(repo.listTemplates().map((t) => ({ id: t.id, name: t.name }))),
  )

  app.get('/api/documents', (c) => c.json(repo.list()))

  app.post('/api/documents', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const document = repo.create({ template: body.template })
    return c.json(document, 201)
  })

  app.get('/api/documents/:id', (c) => {
    const document = repo.get(c.req.param('id'))
    return document
      ? c.json(document)
      : c.json({ error: 'not found' }, 404)
  })

  app.put('/api/documents/:id', async (c) => {
    const body = await c.req.json()
    const document = repo.update(c.req.param('id'), body)
    return document
      ? c.json(document)
      : c.json({ error: 'not found' }, 404)
  })

  app.delete('/api/documents/:id', (c) => {
    const found = repo.delete(c.req.param('id'))
    return found ? c.newResponse(null, 204) : c.json({ error: 'not found' }, 404)
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

  return app
}
