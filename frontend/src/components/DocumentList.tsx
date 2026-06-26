import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DocumentSummary } from '../api/compile'

interface Props {
  documents: DocumentSummary[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export default function DocumentList({ documents, activeId, onSelect, onNew, onDelete }: Props) {
  return (
    <aside className="flex w-56 flex-col border-r bg-sidebar">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-base font-medium text-muted-foreground">
          Documents
        </span>
        <Button variant="outline" size="xs" onClick={onNew}>+ New</Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-px p-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                'group flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors',
                doc.id === activeId
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
              )}
              onClick={() => onSelect(doc.id)}
            >
              <span className="truncate">{doc.title}</span>
              <button
                className="ml-2 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); onDelete(doc.id) }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}
