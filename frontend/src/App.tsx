import { useEffect, useState, useCallback, useRef } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import './App.css'
import DocumentList from './components/DocumentList'
import Toolbar from './components/Toolbar'
import LatexEditor from './components/LatexEditor'
import Preview from './components/Preview'
import ResizableSplit from './components/ResizableSplit'
import {
  fetchDocuments, fetchDocument, createDocument, updateDocument,
  deleteDocument, compileLatex,
} from './api/compile'
import type { Document, DocumentSummary } from './api/compile'

export default function App() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)
  const [source, setSource] = useState('')
  const [title, setTitle] = useState('')
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [editorFontSize, setEditorFontSize] = useState(14)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [autoCompile, setAutoCompile] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const autoCompileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const compileFnRef = useRef(() => {})

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

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
      setDocuments(await fetchDocuments())
    } catch (e) { console.error(e) }
  }, [])

  const loadDocument = useCallback(async (id: string) => {
    try {
      const doc = await fetchDocument(id)
      setCurrentDoc(doc)
      setSource(doc.source)
      setTitle(doc.title)
      setPdfData(null)
      setError(null)
      setIsDirty(false)
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    (async () => {
      const list = await fetchDocuments()
      setDocuments(list)
      if (list.length > 0) {
        loadDocument(list[0].id)
      } else {
        try {
          const doc = await createDocument()
          setDocuments([{ id: doc.id, title: doc.title, created_at: doc.created_at, updated_at: doc.updated_at }])
          loadDocument(doc.id)
        } catch (e) { console.error(e) }
      }
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useCallback(async () => {
    if (!currentDoc) return
    try {
      const updated = await updateDocument(currentDoc.id, { title, source })
      setCurrentDoc(updated)
      setIsDirty(false)
      refreshList()
    } catch (e) { console.error(e) }
  }, [currentDoc, title, source, refreshList])

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
      const pdf = await compileLatex(source)
      setPdfData(pdf)
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
    } catch (e: any) {
      setError(e.message || 'Compilation failed')
    } finally {
      setIsCompiling(false)
    }
  }, [isCompiling, isDirty, source, doSave])

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
      const doc = await createDocument()
      const updated = await updateDocument(doc.id, { title: fileName, source: content })
      setCurrentDoc(updated)
      setSource(updated.source)
      setTitle(updated.title)
      setIsDirty(false)
      refreshList()
    }
  }, [currentDoc, refreshList])

  const handleNew = useCallback(async () => {
    try {
      const doc = await createDocument()
      refreshList()
      loadDocument(doc.id)
    } catch (e) { console.error(e) }
  }, [refreshList, loadDocument])

  const handleDelete = useCallback(async () => {
    if (!currentDoc) return
    try {
      await deleteDocument(currentDoc.id)
      setCurrentDoc(null)
      setSource('')
      setTitle('')
      setPdfData(null)
      setError(null)
      setIsDirty(false)
      await refreshList()
    } catch (e) { console.error(e) }
  }, [currentDoc, refreshList])

  return (
    <TooltipProvider>
      <div className="flex h-dvh w-dvw overflow-hidden bg-background">
        <DocumentList
          documents={documents}
          activeId={currentDoc?.id ?? null}
          onSelect={loadDocument}
          onNew={handleNew}
          onDelete={handleDelete}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Toolbar
            title={title}
            onTitleChange={handleTitleChange}
            onSave={doSave}
            onCompile={handleCompile}
            onDownloadPdf={handleDownloadPdf}
            onDownloadTex={handleDownloadTex}
            onUploadTex={handleUploadTex}
            onNew={handleNew}
            onDelete={handleDelete}
            isCompiling={isCompiling}
            isDirty={isDirty}
            hasPdf={pdfData !== null}
            hasDocument={currentDoc !== null}
            editorFontSize={editorFontSize}
            onEditorFontSizeChange={setEditorFontSize}
            theme={theme}
            onThemeToggle={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}
            autoCompile={autoCompile}
            onAutoCompileToggle={() => setAutoCompile((a) => !a)}
          />
          <div className="flex flex-1 overflow-hidden">
          <ResizableSplit left={<LatexEditor value={source} onChange={handleSourceChange} fontSize={editorFontSize} theme={theme} />} right={<Preview pdfData={pdfData} error={error} isCompiling={isCompiling} />} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
