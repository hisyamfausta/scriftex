import type { Document, DocumentSummary } from '../models/Document.js'
import type { LatexTemplate } from '../models/LatexTemplate.js'

export interface CreateDocumentParams {
  template?: string
}

export interface DocumentRepository {
  list(): Promise<DocumentSummary[]>
  get(id: string): Promise<Document>
  create(params?: CreateDocumentParams): Promise<Document>
  update(id: string, data: { title?: string; source?: string }): Promise<Document>
  delete(id: string): Promise<void>
  compile(source: string): Promise<ArrayBuffer>
  listTemplates(): Promise<LatexTemplate[]>
}
