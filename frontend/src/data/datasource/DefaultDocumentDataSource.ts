import type { Document, DocumentSummary } from '../models/Document.js'
import type { LatexTemplate } from '../models/LatexTemplate.js'
import type { DocumentDataSource, CreateDocumentRequest } from './DocumentDataSource.js'

export class DefaultDocumentDataSource implements DocumentDataSource {
  constructor(private basePath: string = '') {}

  async list(): Promise<DocumentSummary[]> {
    const response = await fetch(`${this.basePath}/api/documents`)
    if (!response.ok) throw new Error('Failed to fetch documents')
    return response.json()
  }

  async get(id: string): Promise<Document> {
    const response = await fetch(`${this.basePath}/api/documents/${id}`)
    if (!response.ok) throw new Error('Document not found')
    return response.json()
  }

  async create(params?: CreateDocumentRequest): Promise<Document> {
    const response = await fetch(`${this.basePath}/api/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params ?? {}),
    })
    if (!response.ok) throw new Error('Failed to create document')
    return response.json()
  }

  async update(
    id: string,
    data: { title?: string; source?: string },
  ): Promise<Document> {
    const response = await fetch(`${this.basePath}/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update document')
    return response.json()
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.basePath}/api/documents/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete document')
  }

  async compile(source: string): Promise<ArrayBuffer> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)

    try {
      const response = await fetch(`${this.basePath}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: source,
        signal: controller.signal,
      })
      if (!response.ok) {
        let message = 'Compilation failed'
        try {
          const body = await response.json()
          message = body.error || message
        } catch {
          message = await response.text().catch(() => message)
        }
        throw new Error(message)
      }
      return response.arrayBuffer()
    } finally {
      clearTimeout(timer)
    }
  }

  async listTemplates(): Promise<LatexTemplate[]> {
    const response = await fetch(`${this.basePath}/api/templates`)
    if (!response.ok) throw new Error('Failed to fetch templates')
    return response.json()
  }
}
