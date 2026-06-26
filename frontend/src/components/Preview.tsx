import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Loader2, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  pdfData: ArrayBuffer | null
  error: string | null
  isCompiling: boolean
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3.0
const ZOOM_STEP = 0.1

export default function Preview({ pdfData, error, isCompiling }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null)
  const [scale, setScale] = useState(1.0)

  const displayError = error || pdfLoadError

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto bg-muted/80 p-4">
      {isCompiling && (
        <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <Badge variant="secondary">Compiling...</Badge>
        </div>
      )}

      {displayError && !isCompiling && (
        <div className="flex w-full max-w-xl flex-col gap-2">
          <Badge variant="destructive" className="w-fit">
            {error ? 'Compilation Error' : 'Preview Error'}
          </Badge>
          <pre className="overflow-x-auto rounded-lg bg-destructive/5 p-4 text-sm text-destructive/90 whitespace-pre-wrap">
            {displayError}
          </pre>
        </div>
      )}

      {pdfData && !isCompiling && (
        <div className="flex w-full flex-col items-center">
          <div className="sticky top-0 z-10 mb-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 backdrop-blur">
            <Button variant="ghost" size="icon-xs" onClick={() => setScale((s) => Math.max(MIN_ZOOM, s - ZOOM_STEP))} disabled={scale <= MIN_ZOOM}>
              <ZoomOut />
            </Button>
            <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="icon-xs" onClick={() => setScale((s) => Math.min(MAX_ZOOM, s + ZOOM_STEP))} disabled={scale >= MAX_ZOOM}>
              <ZoomIn />
            </Button>
          </div>
          <Document
            file={pdfData}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages)
              setPdfLoadError(null)
            }}
            onLoadError={(error) => setPdfLoadError(error.message || 'Failed to render PDF preview')}
          >
            {Array.from(new Array(numPages || 0), (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                scale={scale}
                className="mb-4 rounded-lg shadow-lg"
              />
            ))}
          </Document>
        </div>
      )}

      {!pdfData && !displayError && !isCompiling && (
        <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground">
          <FileText className="size-8" />
          <p className="text-sm">Compile your document to see the PDF preview</p>
        </div>
      )}
    </div>
  )
}
