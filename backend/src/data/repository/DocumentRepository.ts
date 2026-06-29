import type { Document, DocumentSummary } from '../models/Document.js'
import type { LatexTemplate } from '../templates.js'

export interface CreateDocumentParams {
  template?: string
}

export interface DocumentRepository {
  list(): DocumentSummary[]
  get(id: string): Document | undefined
  create(params?: CreateDocumentParams): Document
  update(id: string, data: { title?: string; source?: string }): Document | undefined
  delete(id: string): boolean
  listTemplates(): LatexTemplate[]
}
