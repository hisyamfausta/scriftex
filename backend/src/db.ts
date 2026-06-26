import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const dbPath = process.env.DB_PATH || join(process.cwd(), 'data', 'scriftex.db')
const dbDir = dirname(dbPath)
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })

const db = new Database(dbPath)
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

const defaultTemplate = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Untitled Document}
\\author{}
\\date{\\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Your content here.

\\end{document}`

export interface Document {
  id: string
  title: string
  source: string
  created_at: string
  updated_at: string
}

export interface DocumentSummary {
  id: string
  title: string
  created_at: string
  updated_at: string
}

const listStmt = db.prepare('SELECT id, title, created_at, updated_at FROM documents ORDER BY updated_at DESC')
const getStmt = db.prepare('SELECT * FROM documents WHERE id = ?')
const createStmt = db.prepare('INSERT INTO documents (id, title, source) VALUES (?, ?, ?)')
const updateStmt = db.prepare('UPDATE documents SET title = COALESCE(?, title), source = COALESCE(?, source), updated_at = datetime(\'now\') WHERE id = ?')
const deleteStmt = db.prepare('DELETE FROM documents WHERE id = ?')

export function listDocuments(): DocumentSummary[] {
  return listStmt.all() as DocumentSummary[]
}

export function getDocument(id: string): Document | undefined {
  return getStmt.get(id) as Document | undefined
}

export function createDocument(): Document {
  const id = randomUUID()
  createStmt.run(id, 'Untitled', defaultTemplate)
  return getDocument(id)!
}

export function updateDocument(id: string, data: { title?: string; source?: string }): Document | undefined {
  updateStmt.run(data.title ?? null, data.source ?? null, id)
  return getDocument(id)
}

export function deleteDocument(id: string): boolean {
  const result = deleteStmt.run(id)
  return result.changes > 0
}
