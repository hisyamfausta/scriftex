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

export async function fetchDocuments(): Promise<DocumentSummary[]> {
  const response = await fetch('/api/documents')
  if (!response.ok) throw new Error('Failed to fetch documents')
  return response.json()
}

export async function fetchDocument(id: string): Promise<Document> {
  const response = await fetch(`/api/documents/${id}`)
  if (!response.ok) throw new Error('Document not found')
  return response.json()
}

export async function createDocument(): Promise<Document> {
  const response = await fetch('/api/documents', { method: 'POST' })
  if (!response.ok) throw new Error('Failed to create document')
  return response.json()
}

export async function updateDocument(id: string, data: { title?: string; source?: string }): Promise<Document> {
  const response = await fetch(`/api/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update document')
  return response.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete document')
}

export async function compileLatex(source: string): Promise<ArrayBuffer> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch('/api/compile', {
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
