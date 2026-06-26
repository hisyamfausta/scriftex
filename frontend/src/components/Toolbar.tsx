import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  FilePenLine, Play, Download, Save, Trash2, Plus, Upload, FileCode, Sun, Moon,
} from 'lucide-react'

interface Props {
  title: string
  onTitleChange: (title: string) => void
  onSave: () => void
  onCompile: () => void
  onDownloadPdf: () => void
  onDownloadTex: () => void
  onUploadTex: (file: File) => void
  onNew: () => void
  onDelete: () => void
  isCompiling: boolean
  isDirty: boolean
  hasPdf: boolean
  hasDocument: boolean
  editorFontSize: number
  onEditorFontSizeChange: (size: number) => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  autoCompile: boolean
  onAutoCompileToggle: () => void
}

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]

export default function Toolbar({
  title, onTitleChange, onSave, onCompile, onDownloadPdf,
  onDownloadTex, onUploadTex, onNew, onDelete,
  isCompiling, isDirty, hasPdf, hasDocument,
  editorFontSize, onEditorFontSizeChange,
  theme, onThemeToggle,
  autoCompile, onAutoCompileToggle,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-1.5 border-b bg-muted/30 px-3 py-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onNew}>
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New document</TooltipContent>
      </Tooltip>

      {hasDocument && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onDelete}>
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete document</TooltipContent>
        </Tooltip>
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={() => fileInputRef.current?.click()}>
            <Upload />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Upload .tex file</TooltipContent>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".tex,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onUploadTex(file)
            e.target.value = ''
          }
        }}
      />

      {hasDocument && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onDownloadTex}>
              <FileCode />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download .tex file</TooltipContent>
        </Tooltip>
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <FilePenLine className="size-4 shrink-0 text-muted-foreground" />
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Document title"
        className="h-7 max-w-64 border-transparent bg-transparent text-sm hover:border-input focus:border-ring focus:bg-background"
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <select
            value={editorFontSize}
            onChange={(e) => onEditorFontSizeChange(Number(e.target.value))}
            className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs text-muted-foreground outline-none hover:border-ring focus:border-ring"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </TooltipTrigger>
        <TooltipContent>Editor font size</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onThemeToggle}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
      </Tooltip>

      <div className="ml-auto flex items-center gap-1.5">
        {hasDocument && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onSave} disabled={!isDirty}>
                <Save />
                {isDirty ? 'Save' : 'Saved'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDirty ? 'Save changes' : 'All changes saved'}</TooltipContent>
          </Tooltip>
        )}

        <Button size="sm" onClick={onCompile} disabled={isCompiling}>
          <Play />
          {isCompiling ? 'Compiling...' : 'Compile'}
        </Button>

        {hasDocument && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={autoCompile ? 'default' : 'outline'} size="sm" onClick={onAutoCompileToggle}>
                <Play className={autoCompile ? 'text-green-400' : ''} />
                Auto
              </Button>
            </TooltipTrigger>
            <TooltipContent>{autoCompile ? 'Auto-compile on' : 'Auto-compile off'}</TooltipContent>
          </Tooltip>
        )}

        {hasPdf && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onDownloadPdf}>
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download PDF</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
