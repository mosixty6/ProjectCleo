'use client'

import { useState } from 'react'
import { AnalysisResult, Medication } from '@/lib/types'

interface CouncilMember {
  id: string
  name: string
  color: string
  opinion: string
}

interface Props {
  transcript: string
  medications: Medication[]
  result: AnalysisResult
}

const STYLES: Record<string, { border: string; header: string; bg: string }> = {
  blue:   { border: 'border-blue-100',   header: 'text-blue-800',   bg: 'bg-blue-50'   },
  green:  { border: 'border-emerald-100', header: 'text-emerald-800', bg: 'bg-emerald-50' },
  purple: { border: 'border-purple-100', header: 'text-purple-800', bg: 'bg-purple-50'  },
  orange: { border: 'border-orange-100', header: 'text-orange-800', bg: 'bg-orange-50'  },
}

const ICONS: Record<string, string> = {
  psychiatrist: '🧠',
  pharmacist:   '⚗️',
  advocate:     '🤝',
  internist:    '🩺',
}

const PLACEHOLDER_NAMES = ['Psychiatrist', 'Clinical Pharmacist', 'Patient Advocate', 'Internist']

export default function CouncilPanel({ transcript, medications, result }: Props) {
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<CouncilMember[]>([])
  const [convened, setConvened] = useState(false)

  const convene = async () => {
    setLoading(true)
    setConvened(false)
    try {
      const res = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, medications, analysis: result }),
      })
      const data = await res.json()
      setMembers(data.members)
      setConvened(true)
    } finally {
      setLoading(false)
    }
  }

  // Idle state
  if (!loading && !convened) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-800">Claude Council</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              4 clinical perspectives in parallel — psychiatrist, pharmacist,<br className="hidden sm:block" /> patient advocate, and internist review the same case simultaneously.
            </p>
          </div>
          <button
            onClick={convene}
            className="shrink-0 bg-slate-800 hover:bg-slate-900 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>⚖️</span>
            Convene
          </button>
        </div>
      </div>
    )
  }

  // Loading state — skeleton cards
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Claude Council</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLACEHOLDER_NAMES.map((name) => (
            <div key={name} className="rounded-xl border border-slate-100 bg-slate-50 p-4 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-slate-200" />
                <div className="h-3 bg-slate-200 rounded w-28" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-200 rounded" />
                <div className="h-2 bg-slate-200 rounded w-5/6" />
                <div className="h-2 bg-slate-200 rounded w-4/6" />
                <div className="h-2 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-slate-400 mt-4 animate-pulse">Convening council…</p>
      </div>
    )
  }

  // Results
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Claude Council</h3>
        <button
          onClick={convene}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Reconvene
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member) => {
          const s = STYLES[member.color] ?? STYLES.blue
          return (
            <div key={member.id} className={`rounded-xl border ${s.border} p-4`}>
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${s.border}`}>
                <span className="text-xl">{ICONS[member.id] ?? '👤'}</span>
                <span className={`text-sm font-semibold ${s.header}`}>{member.name}</span>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {member.opinion}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
