'use client'

import { useState } from 'react'
import { FormularyResult, AnalysisResult } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  covered: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  'non-preferred': 'bg-yellow-50 text-yellow-800 border-yellow-100',
  'pa-required': 'bg-orange-50 text-orange-800 border-orange-100',
  'not-covered': 'bg-red-50 text-red-800 border-red-100',
  unknown: 'bg-slate-50 text-slate-600 border-slate-200',
}

const STATUS_LABEL: Record<string, string> = {
  covered: 'Covered',
  'non-preferred': 'Non-preferred',
  'pa-required': 'PA Required',
  'not-covered': 'Not Covered',
  unknown: 'Unknown',
}

interface Props {
  formulary: FormularyResult
  result: AnalysisResult
  onDraftPA: (medication: string) => void
  draftingPA: string | null
  paDrafts: Record<string, string>
}

export default function FormularyResults({ formulary, result, onDraftPA, draftingPA, paDrafts }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyLetter = async (med: string) => {
    await navigator.clipboard.writeText(paDrafts[med])
    setCopied(med)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Formulary Check</h3>
        <span className="text-xs text-slate-400">{formulary.plan}</span>
      </div>

      <div className="space-y-2">
        {formulary.items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 py-2">
              <span className="text-sm font-medium text-slate-700 capitalize flex-1">{item.name}</span>
              {item.tier && (
                <span className="text-xs text-slate-400">Tier {item.tier}</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[item.status] ?? STATUS_STYLES.unknown}`}>
                {STATUS_LABEL[item.status] ?? item.status}
              </span>
              {item.status === 'pa-required' && (
                <button
                  onClick={() => onDraftPA(item.name)}
                  disabled={!!draftingPA}
                  className="text-xs bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white px-2.5 py-1 rounded-lg font-medium transition-colors"
                >
                  {draftingPA === item.name ? 'Drafting…' : 'Draft PA'}
                </button>
              )}
            </div>
            {item.notes && (
              <p className="text-xs text-slate-500 ml-0 mb-1">{item.notes}</p>
            )}

            {paDrafts[item.name] && (
              <div className="mt-2 mb-3 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">PA Letter — {item.name}</span>
                  <button
                    onClick={() => copyLetter(item.name)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {copied === item.name ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {paDrafts[item.name]}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {formulary.paRequired.length > 0 && (
        <p className="text-xs text-orange-700 mt-3 pt-3 border-t border-slate-100">
          PA required for: {formulary.paRequired.join(', ')}
        </p>
      )}
    </div>
  )
}
