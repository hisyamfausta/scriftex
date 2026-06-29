export interface Document {
  id: string
  title: string
  source: string
  createdAt: Date
  updatedAt: Date
}

export interface DocumentSummary {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}
