import type Database from 'better-sqlite3'
import type { DocumentEntity, DocumentSummaryEntity } from '../models/DocumentEntity.js'
import type { DocumentDataSource } from './DocumentDataSource.js'
import { TEMPLATES } from '../templates.js'
import type { LatexTemplate } from '../templates.js'

export class DefaultDocumentDataSource implements DocumentDataSource {
  private listStmt
  private getStmt
  private insertStmt
  private updateStmt
  private deleteStmt
  private listTemplatesStmt
  private getTemplateStmt

  constructor(db: Database.Database) {
    db.pragma('journal_mode = WAL')

    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT 'Untitled',
        source TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source TEXT NOT NULL
      )
    `)

    const upsert = db.prepare('INSERT OR REPLACE INTO templates (id, name, source) VALUES (?, ?, ?)')
    for (const t of TEMPLATES) {
      upsert.run(t.id, t.name, t.source)
    }

    this.listStmt = db.prepare(
      'SELECT id, title, created_at, updated_at FROM documents ORDER BY updated_at DESC',
    )
    this.getStmt = db.prepare('SELECT * FROM documents WHERE id = ?')
    this.insertStmt = db.prepare(
      'INSERT INTO documents (id, title, source) VALUES (?, ?, ?)',
    )
    this.updateStmt = db.prepare(
      "UPDATE documents SET title = COALESCE(?, title), source = COALESCE(?, source), updated_at = datetime('now') WHERE id = ?",
    )
    this.deleteStmt = db.prepare('DELETE FROM documents WHERE id = ?')
    this.listTemplatesStmt = db.prepare('SELECT * FROM templates ORDER BY id')
    this.getTemplateStmt = db.prepare('SELECT * FROM templates WHERE id = ?')
  }

  list(): DocumentSummaryEntity[] {
    return this.listStmt.all() as DocumentSummaryEntity[]
  }

  get(id: string): DocumentEntity | undefined {
    return this.getStmt.get(id) as DocumentEntity | undefined
  }

  insert(params: { id: string; title: string; source: string }): DocumentEntity {
    this.insertStmt.run(params.id, params.title, params.source)
    return this.get(params.id)!
  }

  update(
    id: string,
    data: { title?: string; source?: string },
  ): DocumentEntity | undefined {
    this.updateStmt.run(data.title ?? null, data.source ?? null, id)
    return this.get(id)
  }

  delete(id: string): boolean {
    const result = this.deleteStmt.run(id)
    return result.changes > 0
  }

  listTemplates(): LatexTemplate[] {
    return this.listTemplatesStmt.all() as LatexTemplate[]
  }

  getTemplate(id: string): LatexTemplate | undefined {
    return this.getTemplateStmt.get(id) as LatexTemplate | undefined
  }
}
