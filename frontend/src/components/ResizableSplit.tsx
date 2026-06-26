import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'

interface Props {
  left: ReactNode
  right: ReactNode
  defaultLeftPercent?: number
  minLeftPx?: number
  minRightPx?: number
}

export default function ResizableSplit({ left, right, defaultLeftPercent = 50, minLeftPx = 200, minRightPx = 200 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent)
  const draggingRef = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = true
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100
    const minPercent = (minLeftPx / rect.width) * 100
    const maxPercent = 100 - (minRightPx / rect.width) * 100
    setLeftPercent(Math.max(minPercent, Math.min(maxPercent, percent)))
  }, [minLeftPx, minRightPx])

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      <div style={{ width: `${leftPercent}%` }} className="flex flex-col h-full overflow-hidden">
        {left}
      </div>
      <div
        className="flex w-1 cursor-col-resize shrink-0 items-center justify-center bg-border hover:bg-ring active:bg-ring transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="h-8 w-0.5 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="flex flex-1 h-full overflow-hidden">
        {right}
      </div>
    </div>
  )
}
