import type { Document, DocumentSummary } from '../models/Document.js'
import type { LatexTemplate } from '../models/LatexTemplate.js'
import type { DocumentDataSource } from '../datasource/DocumentDataSource.js'
import type { DocumentRepository, CreateDocumentParams } from './DocumentRepository.js'

export class DefaultDocumentRepository implements DocumentRepository {
  constructor(private dataSource: DocumentDataSource) {}

  list(): Promise<DocumentSummary[]> {
    return this.dataSource.list()
  }

  get(id: string): Promise<Document> {
    return this.dataSource.get(id)
  }

  create(params?: CreateDocumentParams): Promise<Document> {
    return this.dataSource.create(params)
  }

  update(
    id: string,
    data: { title?: string; source?: string },
  ): Promise<Document> {
    return this.dataSource.update(id, data)
  }

  delete(id: string): Promise<void> {
    return this.dataSource.delete(id)
  }

  compile(source: string): Promise<ArrayBuffer> {
    return this.dataSource.compile(source)
  }

  listTemplates(): Promise<LatexTemplate[]> {
    return this.dataSource.listTemplates()
  }
}
