import { useEffect, useState } from 'react'

export function usePreferenceViewModel() {
  const [editorFontSize, setEditorFontSize] = useState(14)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [autoCompile, setAutoCompile] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return { editorFontSize, setEditorFontSize, theme, setTheme, autoCompile, setAutoCompile }
}
