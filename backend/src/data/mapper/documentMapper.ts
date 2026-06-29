import type { DocumentEntity, DocumentSummaryEntity } from '../models/DocumentEntity.js'
import type { Document, DocumentSummary } from '../models/Document.js'

export function mapEntityToDocument(entity: DocumentEntity): Document {
  return {
    id: entity.id,
    title: entity.title,
    source: entity.source,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
  }
}

export function mapEntityToSummary(entity: DocumentSummaryEntity): DocumentSummary {
  return {
    id: entity.id,
    title: entity.title,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
  }
}

export function mapDocumentToEntity(document: Document): DocumentEntity {
  return {
    id: document.id,
    title: document.title,
    source: document.source,
    created_at: document.createdAt.toISOString(),
    updated_at: document.updatedAt.toISOString(),
  }
}
