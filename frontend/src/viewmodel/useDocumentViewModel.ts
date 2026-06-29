import { useEffect, useState, useCallback, useRef } from 'react'
import type { Document, DocumentSummary } from '../data/models/Document.js'
import type { LatexTemplate } from '../data/models/LatexTemplate.js'
import type { DocumentRepository } from '../data/repository/DocumentRepository.js'

export function useDocumentViewModel(repository: DocumentRepository, autoCompile: boolean) {
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)
  const [source, setSource] = useState('')
  const [title, setTitle] = useState('')
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [templates, setTemplates] = useState<LatexTemplate[]>([])

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const autoCompileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const compileFnRef = useRef(() => {})

  useEffect(() => {
    if (!autoCompile || !source) return
    if (autoCompileTimerRef.current) clearTimeout(autoCompileTimerRef.current)
    autoCompileTimerRef.current = setTimeout(() => compileFnRef.current(), 3000)
    return () => {
      if (autoCompileTimerRef.current) clearTimeout(autoCompileTimerRef.current)
    }
  }, [source, autoCompile])

  const refreshList = useCallback(async () => {
    try {
      setDocuments(await repository.list())
    } catch (e) { console.error(e) }
  }, [repository])

  const loadDocument = useCallback(async (id: string) => {
    try {
      const doc = await repository.get(id)
      setCurrentDoc(doc)
      setSource(doc.source)
      setTitle(doc.title)
      setPdfData(null)
      setError(null)
      setIsDirty(false)
    } catch (e) { console.error(e) }
  }, [repository])

  useEffect(() => {
    (async () => {
      const [list, allTemplates] = await Promise.all([
        repository.list(),
        repository.listTemplates().catch(() => [] as LatexTemplate[]),
      ])
      setDocuments(list)
      setTemplates(allTemplates)
      if (list.length > 0) {
        loadDocument(list[0].id)
      } else {
        try {
          const doc = await repository.create()
          setDocuments([{ id: doc.id, title: doc.title, createdAt: doc.createdAt, updatedAt: doc.updatedAt }])
          loadDocument(doc.id)
        } catch (e) { console.error(e) }
      }
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useCallback(async () => {
    if (!currentDoc) return
    try {
      const updated = await repository.update(currentDoc.id, { title, source })
      setCurrentDoc(updated)
      setIsDirty(false)
      refreshList()
    } catch (e) { console.error(e) }
  }, [currentDoc, title, source, refreshList, repository])

  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(doSave, 2000)
  }, [doSave])

  const handleSourceChange = useCallback((value: string) => {
    setSource(value)
    setIsDirty(true)
    debouncedSave()
  }, [debouncedSave])

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value)
    setIsDirty(true)
    debouncedSave()
  }, [debouncedSave])

  const handleCompile = useCallback(async () => {
    if (isCompiling) return
    setIsCompiling(true)
    setError(null)
    setPdfData(null)
    try {
      if (isDirty) await doSave()
      const pdf = await repository.compile(source)
      setPdfData(pdf)
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
    } catch (e: any) {
      setError(e.message || 'Compilation failed')
    } finally {
      setIsCompiling(false)
    }
  }, [isCompiling, isDirty, source, doSave, repository])

  compileFnRef.current = handleCompile

  const handleDownloadPdf = useCallback(() => {
    if (!downloadUrlRef.current) return
    const a = document.createElement('a')
    a.href = downloadUrlRef.current
    a.download = `${title.replace(/\s+/g, '_')}.pdf`
    a.click()
  }, [title])

  const handleDownloadTex = useCallback(() => {
    if (!source) return
    const blob = new Blob([source], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}.tex`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [source, title])

  const handleUploadTex = useCallback(async (file: File) => {
    const content = await file.text()
    setPdfData(null)
    setError(null)
    const fileName = file.name.replace(/\.tex$/i, '').replace(/\.txt$/i, '')
    if (currentDoc) {
      setSource(content)
      setTitle(fileName)
      setIsDirty(true)
    } else {
      try {
        const doc = await repository.create()
        const updated = await repository.update(doc.id, { title: fileName, source: content })
        setCurrentDoc(updated)
        setSource(updated.source)
        setTitle(updated.title)
        setIsDirty(false)
        refreshList()
      } catch (e) { console.error(e) }
    }
  }, [currentDoc, repository, refreshList])

  const handleCreateDocument = useCallback(async (templateId?: string) => {
    try {
      const doc = await repository.create({ template: templateId })
      refreshList()
      loadDocument(doc.id)
    } catch (e) { console.error(e) }
  }, [refreshList, loadDocument, repository])

  const handleDelete = useCallback(async () => {
    if (!currentDoc) return
    try {
      await repository.delete(currentDoc.id)
      setCurrentDoc(null)
      setSource('')
      setTitle('')
      setPdfData(null)
      setError(null)
      setIsDirty(false)
      await refreshList()
    } catch (e) { console.error(e) }
  }, [currentDoc, repository, refreshList])

  return {
    documents,
    currentDoc,
    source,
    title,
    pdfData,
    error,
    isCompiling,
    isDirty,
    templates,
    loadDocument,
    handleSourceChange,
    handleTitleChange,
    handleCompile,
    handleDownloadPdf,
    handleDownloadTex,
    handleUploadTex,
    handleCreateDocument,
    handleDelete,
    doSave,
  }
}
