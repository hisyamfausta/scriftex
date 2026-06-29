import type { DocumentEntity, DocumentSummaryEntity } from '../models/DocumentEntity.js'
import type { LatexTemplate } from '../templates.js'

export interface DocumentDataSource {
  list(): DocumentSummaryEntity[]
  get(id: string): DocumentEntity | undefined
  insert(params: { id: string; title: string; source: string }): DocumentEntity
  update(id: string, data: { title?: string; source?: string }): DocumentEntity | undefined
  delete(id: string): boolean
  listTemplates(): LatexTemplate[]
  getTemplate(id: string): LatexTemplate | undefined
}
