'use client'

import { useState } from 'react'
import { MindMetrixAssessment, MindMetrixConditionScore } from '@/lib/types'

const DEMO_DATA: MindMetrixAssessment = {
  assessmentId: 'MM-2024-8847',
  completedDate: new Date().toLocaleDateString(),
  conditionScores: [
    { condition: 'Major Depression', domain: 'mood', score: 72, severity: 'moderate', flag: true },
    { condition: 'Generalized Anxiety', domain: 'anxiety', score: 68, severity: 'moderate', flag: true },
    { condition: 'ADHD', domain: 'adhd', score: 58, severity: 'moderate', flag: true },
    { condition: 'PTSD', domain: 'trauma', score: 41, severity: 'mild', flag: false },
    { condition: 'Bipolar II', domain: 'mood', score: 35, severity: 'mild', flag: false },
    { condition: 'OCD', domain: 'anxiety', score: 28, severity: 'mild', flag: false },
    { condition: 'Substance Use', domain: 'substance', score: 18, severity: 'minimal', flag: false },
    { condition: 'Psychosis', domain: 'psychosis', score: 6, severity: 'minimal', flag: false },
  ],
  topFlags: ['Major Depression', 'Generalized Anxiety', 'ADHD'],
  notes: 'Patient completed assessment online. Response rate 94%. Duration: 42 minutes.',
}

const DOMAIN_ICONS: Record<string, string> = {
  mood: '🧠',
  anxiety: '💭',
  trauma: '⚡',
  adhd: '🎯',
  substance: '⚗️',
  psychosis: '🌀',
  personality: '👤',
  other: '📋',
}

function scoreBarColor(score: number): string {
  if (score < 26) return 'bg-emerald-400'
  if (score < 51) return 'bg-yellow-400'
  if (score < 76) return 'bg-orange-400'
  return 'bg-red-500'
}

function scoreLabelColor(score: number): string {
  if (score < 26) return 'text-emerald-600'
  if (score < 51) return 'text-yellow-600'
  if (score < 76) return 'text-orange-600'
  return 'text-red-600'
}

interface Props {
  assessment: MindMetrixAssessment | null
  onChange: (assessment: MindMetrixAssessment | null) => void
}

export default function MindMetrixPanel({ assessment, onChange }: Props) {
  const [importing, setImporting] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [parseError, setParseError] = useState('')

  const loadJSON = () => {
    setParseError('')
    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.conditionScores || !Array.isArray(parsed.conditionScores)) {
        throw new Error('Expected { conditionScores: [...] }')
      }
      onChange(parsed as MindMetrixAssessment)
      setImporting(false)
      setJsonInput('')
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const ChartIcon = () => (
    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )

  if (!assessment && !importing) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center shrink-0">
            <ChartIcon />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">MindMetrix Assessment</h3>
        </div>
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 mb-1 font-medium">No assessment loaded</p>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Connect a patient assessment to inform medication recommendations
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setImporting(true)}
              className="w-full text-sm bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Import Assessment JSON
            </button>
            <button
              onClick={() => onChange(DEMO_DATA)}
              className="w-full text-sm border border-teal-200 text-teal-600 hover:bg-teal-50 py-2 rounded-lg font-medium transition-colors"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (importing) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center shrink-0">
              <ChartIcon />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Import Assessment JSON</h3>
          </div>
          <button
            onClick={() => { setImporting(false); setParseError('') }}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Cancel
          </button>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={'{\n  "assessmentId": "MM-2024-...",\n  "completedDate": "...",\n  "conditionScores": [...],\n  "topFlags": [...]\n}'}
          rows={7}
          className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono resize-none"
        />
        {parseError && (
          <p className="text-xs text-red-600 mt-1.5">{parseError}</p>
        )}
        <div className="flex gap-2 mt-3">
          <button
            onClick={loadJSON}
            disabled={!jsonInput.trim()}
            className="flex-1 text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Load
          </button>
          <button
            onClick={() => { onChange(DEMO_DATA); setImporting(false) }}
            className="flex-1 text-sm border border-teal-200 text-teal-700 hover:bg-teal-50 py-2 rounded-lg font-medium transition-colors"
          >
            Use Demo
          </button>
        </div>
      </div>
    )
  }

  const flagged = assessment!.conditionScores.filter((c) => c.flag)
  const others = assessment!.conditionScores.filter((c) => !c.flag)
  const allSorted = [...flagged, ...others]

  return (
    <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center shrink-0">
            <ChartIcon />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">MindMetrix</h3>
          <span className="text-[11px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
            Connected
          </span>
        </div>
        <button
          onClick={() => onChange(null)}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        {assessment!.assessmentId && (
          <span className="text-[10px] font-mono bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
            {assessment!.assessmentId}
          </span>
        )}
        <span className="text-[10px] text-slate-400">{assessment!.completedDate}</span>
        <span className="text-[10px] text-slate-300">·</span>
        <span className="text-[10px] text-slate-400">{assessment!.conditionScores.length} conditions</span>
      </div>

      {flagged.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {flagged.map((c) => (
            <span key={c.condition} className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
              ↑ {c.condition}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        {allSorted.map((c: MindMetrixConditionScore) => (
          <div key={c.condition}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{DOMAIN_ICONS[c.domain] ?? '📋'}</span>
                <span className={`text-[11px] font-medium ${c.flag ? 'text-slate-700' : 'text-slate-400'}`}>
                  {c.condition}
                </span>
              </div>
              <span className={`text-[11px] font-bold tabular-nums ${scoreLabelColor(c.score)}`}>
                {c.score}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBarColor(c.score)}`}
                style={{ width: `${c.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {assessment!.notes && (
        <p className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
          {assessment!.notes}
        </p>
      )}
    </div>
  )
}
