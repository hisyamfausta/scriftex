import { TooltipProvider } from '@/components/ui/tooltip'
import './App.css'
import DocumentList from './components/DocumentList'
import Toolbar from './components/Toolbar'
import LatexEditor from './components/LatexEditor'
import Preview from './components/Preview'
import ResizableSplit from './components/ResizableSplit'
import { DefaultDocumentDataSource } from './data/datasource/DefaultDocumentDataSource'
import { DefaultDocumentRepository } from './data/repository/DefaultDocumentRepository'
import { useDocumentViewModel } from './viewmodel/useDocumentViewModel'
import { usePreferenceViewModel } from './viewmodel/usePreferenceViewModel'

const repository = new DefaultDocumentRepository(new DefaultDocumentDataSource())

export default function App() {
  const prefVm = usePreferenceViewModel()
  const docVm = useDocumentViewModel(repository, prefVm.autoCompile)

  return (
    <TooltipProvider>
      <div className="flex h-dvh w-dvw overflow-hidden bg-background">
        <DocumentList
          documents={docVm.documents}
          activeId={docVm.currentDoc?.id ?? null}
          onSelect={docVm.loadDocument}
          onNew={docVm.handleCreateDocument}
          onDelete={docVm.handleDelete}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Toolbar
            title={docVm.title}
            onTitleChange={docVm.handleTitleChange}
            onSave={docVm.doSave}
            onCompile={docVm.handleCompile}
            onDownloadPdf={docVm.handleDownloadPdf}
            onDownloadTex={docVm.handleDownloadTex}
            onUploadTex={docVm.handleUploadTex}
            onNew={docVm.handleCreateDocument}
            onDelete={docVm.handleDelete}
            isCompiling={docVm.isCompiling}
            isDirty={docVm.isDirty}
            hasPdf={docVm.pdfData !== null}
            hasDocument={docVm.currentDoc !== null}
            editorFontSize={prefVm.editorFontSize}
            onEditorFontSizeChange={prefVm.setEditorFontSize}
            theme={prefVm.theme}
            onThemeToggle={() => prefVm.setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            autoCompile={prefVm.autoCompile}
            onAutoCompileToggle={() => prefVm.setAutoCompile((a) => !a)}
            templates={docVm.templates.map((t) => ({ id: t.id, name: t.name }))}
          />
          <div className="flex flex-1 overflow-hidden">
            <ResizableSplit
              left={
                <LatexEditor
                  value={docVm.source}
                  onChange={docVm.handleSourceChange}
                  fontSize={prefVm.editorFontSize}
                  theme={prefVm.theme}
                />
              }
              right={
                <Preview
                  pdfData={docVm.pdfData}
                  error={docVm.error}
                  isCompiling={docVm.isCompiling}
                />
              }
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
