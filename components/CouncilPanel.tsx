'use client'

import { useState } from 'react'
import { AnalysisResult, Medication } from '@/lib/types'

type CouncilType = 'clinical' | 'business' | 'highstakes'

interface CouncilMember {
  id: string
  name: string
  color: string
  opinion: string
}

interface TabState {
  loading: boolean
  members: CouncilMember[]
  convened: boolean
  context: string
}

interface Props {
  transcript: string
  medications: Medication[]
  result: AnalysisResult
}

const TABS: { id: CouncilType; label: string; icon: string; description: string; placeholder?: string }[] = [
  {
    id: 'clinical',
    label: 'Clinical',
    icon: '🏥',
    description: 'Uses your current analysis automatically',
  },
  {
    id: 'business',
    label: 'Business',
    icon: '📈',
    description: 'Practice growth, revenue, operations, referrals',
    placeholder: `Describe your practice situation or question.\n\nExample: "I'm considering moving to cash-pay only. Currently 60% insurance, 40% self-pay, panel full at 45 patients. Should I do it and how?"`,
  },
  {
    id: 'highstakes',
    label: 'High-Stakes',
    icon: '⚡',
    description: 'Big consequential decisions — risk, downside, integrity check',
    placeholder: `Describe the decision you're facing.\n\nExample: "Considering a partnership with a local hospital system. They want 30% of gross revenue for office space in their MOB. 3-year commitment, exclusivity clause."`,
  },
]

const STYLES: Record<string, { border: string; header: string }> = {
  blue:   { border: 'border-blue-100',   header: 'text-blue-800'    },
  green:  { border: 'border-emerald-100', header: 'text-emerald-800' },
  purple: { border: 'border-purple-100', header: 'text-purple-800'  },
  orange: { border: 'border-orange-100', header: 'text-orange-800'  },
  indigo: { border: 'border-indigo-100', header: 'text-indigo-800'  },
  rose:   { border: 'border-rose-100',   header: 'text-rose-800'    },
  teal:   { border: 'border-teal-100',   header: 'text-teal-800'    },
  slate:  { border: 'border-slate-200',  header: 'text-slate-700'   },
  red:    { border: 'border-red-100',    header: 'text-red-800'     },
  amber:  { border: 'border-amber-100',  header: 'text-amber-800'   },
  violet: { border: 'border-violet-100', header: 'text-violet-800'  },
}

const ICONS: Record<string, string> = {
  psychiatrist: '🧠', pharmacist: '⚗️', advocate: '🤝', internist: '🩺', professor: '🎓',
  ceo: '🏢', marketer: '📣', cfo: '💰', operations: '⚙️', referral: '🤝', legal: '⚖️',
  strategist: '🎯', risk: '📉', devil: '😈', ethicist: '🧭', returns: '📊',
}

const INITIAL_TAB: TabState = { loading: false, members: [], convened: false, context: '' }

export default function CouncilPanel({ transcript, medications, result }: Props) {
  const [active, setActive] = useState<CouncilType>('clinical')
  const [state, setState] = useState<Record<CouncilType, TabState>>({
    clinical: { ...INITIAL_TAB },
    business: { ...INITIAL_TAB },
    highstakes: { ...INITIAL_TAB },
  })

  const update = (type: CouncilType, patch: Partial<TabState>) =>
    setState((prev) => ({ ...prev, [type]: { ...prev[type], ...patch } }))

  const convene = async (type: CouncilType) => {
    update(type, { loading: true, convened: false, members: [] })
    try {
      const body: Record<string, unknown> = { councilType: type }
      if (type === 'clinical') {
        body.transcript = transcript
        body.medications = medications
        body.analysis = result
      } else {
        body.context = state[type].context
      }
      const res = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      update(type, { members: data.members, convened: true })
    } finally {
      update(type, { loading: false })
    }
  }

  const tab = TABS.find((t) => t.id === active)!
  const current = state[active]

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
              active === t.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">
              {tab.icon} {tab.label} Council
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{tab.description}</p>
          </div>
          {(current.convened || current.loading) && (
            <button
              onClick={() => convene(active)}
              disabled={current.loading}
              className="shrink-0 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Reconvene
            </button>
          )}
        </div>

        {/* Context input for Business + High-Stakes */}
        {active !== 'clinical' && (
          <div className="mb-4">
            <textarea
              value={current.context}
              onChange={(e) => update(active, { context: e.target.value })}
              placeholder={tab.placeholder}
              rows={5}
              className="w-full text-sm border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-slate-700 placeholder-slate-300"
            />
          </div>
        )}

        {/* Idle — show convene button */}
        {!current.loading && !current.convened && (
          <button
            onClick={() => convene(active)}
            disabled={active !== 'clinical' && !current.context.trim()}
            className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>⚖️</span>
            Convene {tab.label} Council
          </button>
        )}

        {/* Loading skeleton */}
        {current.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Array.from({ length: active === 'business' ? 6 : active === 'highstakes' ? 5 : 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-slate-200" />
                  <div className="h-3 bg-slate-200 rounded w-28" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded" />
                  <div className="h-2 bg-slate-200 rounded w-5/6" />
                  <div className="h-2 bg-slate-200 rounded w-4/6" />
                </div>
              </div>
            ))}
            <p className="col-span-full text-xs text-center text-slate-400 animate-pulse">Convening council…</p>
          </div>
        )}

        {/* Results */}
        {current.convened && current.members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {current.members.map((member) => {
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
        )}
      </div>
    </div>
  )
}
