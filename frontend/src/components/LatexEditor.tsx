import Editor from '@monaco-editor/react'

interface Props {
  value: string
  onChange: (value: string) => void
  fontSize: number
  theme: 'light' | 'dark'
}

export default function LatexEditor({ value, onChange, fontSize, theme }: Props) {
  return (
    <div className="editor">
      <Editor
        height="100%"
        language="latex"
        theme={theme === 'dark' ? 'latex-dark' : 'latex-light'}
        value={value}
        onChange={(value) => onChange(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  )
}
