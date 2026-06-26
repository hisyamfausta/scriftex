import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import './index.css'

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs'

loader.config({ monaco })

monaco.languages.register({ id: 'latex' })
monaco.languages.setMonarchTokensProvider('latex', {
  tokenizer: {
    root: [
      [/\$/, 'string'],
      [/\$\$/, 'string'],
      [/%.*$/, 'comment'],
      [/\\[a-zA-Z]+(\{[^}]*\})?/, 'tag'],
      [/\\begin\{[^}]*\}/, 'tag'],
      [/\\end\{[^}]*\}/, 'tag'],
    ],
  },
})
monaco.editor.defineTheme('latex-dark', {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'tag', foreground: '569cd6' },
    { token: 'string', foreground: 'ce9178' },
    { token: 'comment', foreground: '6a9955' },
  ],
  colors: {},
})

monaco.editor.defineTheme('latex-light', {
  base: 'vs' as const,
  inherit: true,
  rules: [
    { token: 'tag', foreground: '0550ae' },
    { token: 'string', foreground: '953800' },
    { token: 'comment', foreground: '096a1c' },
  ],
  colors: {
    'editor.background': '#fafafa',
  },
})

import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
