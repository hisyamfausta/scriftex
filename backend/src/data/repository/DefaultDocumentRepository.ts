import { randomUUID } from 'crypto'
import type { DocumentDataSource } from '../datasource/DocumentDataSource.js'
import type { Document, DocumentSummary } from '../models/Document.js'
import {
  mapEntityToDocument,
  mapEntityToSummary,
} from '../mapper/documentMapper.js'
import type { DocumentRepository, CreateDocumentParams } from './DocumentRepository.js'

const DEFAULT_TITLE: Record<string, string> = {
  'ats-resume': 'Resume',
}

export class DefaultDocumentRepository implements DocumentRepository {
  constructor(private dataSource: DocumentDataSource) {}

  list(): DocumentSummary[] {
    return this.dataSource.list().map(mapEntityToSummary)
  }

  get(id: string): Document | undefined {
    const entity = this.dataSource.get(id)
    return entity ? mapEntityToDocument(entity) : undefined
  }

  create(params?: CreateDocumentParams): Document {
    const template = params?.template
      ? this.dataSource.getTemplate(params.template) ?? this.dataSource.getTemplate('blank')!
      : this.dataSource.getTemplate('blank')!
    const source = template.source
    const title = template?.id ? DEFAULT_TITLE[template.id] ?? 'Untitled' : 'Untitled'
    const entity = this.dataSource.insert({
      id: randomUUID(),
      title,
      source,
    })
    return mapEntityToDocument(entity)
  }

  update(
    id: string,
    data: { title?: string; source?: string },
  ): Document | undefined {
    const entity = this.dataSource.update(id, data)
    return entity ? mapEntityToDocument(entity) : undefined
  }

  delete(id: string): boolean {
    return this.dataSource.delete(id)
  }

  listTemplates() {
    return this.dataSource.listTemplates()
  }
}
