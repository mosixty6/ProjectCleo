'use client'

import { useState } from 'react'

export default function BerriesNotePanel({ note }: { note: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(note)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-800">Berries Note</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ready to paste into Berries or your EHR</p>
        </div>
        <button
          onClick={copy}
          className="text-sm bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 rounded-lg p-4 border border-slate-100">
        {note}
      </pre>
    </div>
  )
}
