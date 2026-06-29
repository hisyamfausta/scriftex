import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { DefaultDocumentDataSource } from '../data/datasource/DefaultDocumentDataSource.js'
import { DefaultDocumentRepository } from '../data/repository/DefaultDocumentRepository.js'
import { createDocumentController } from '../controller/documentController.js'

function createDefaultDatabase(): Database.Database {
  const dbPath = process.env.DB_PATH || join(process.cwd(), 'data', 'scriftex.db')
  const dbDir = dirname(dbPath)
  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })
  return new Database(dbPath)
}

export function createApp(): Hono {
  const db = createDefaultDatabase()
  const dataSource = new DefaultDocumentDataSource(db)
  const repository = new DefaultDocumentRepository(dataSource)
  const latexUrl = process.env.LATEX_SERVICE_URL || 'http://localhost:4000'

  const app = new Hono()
  app.use('/api/*', cors())
  app.get('/api/health', (c) => c.json({ status: 'ok' }))

  const routes = createDocumentController(repository, latexUrl)
  app.route('/', routes)

  return app
}
