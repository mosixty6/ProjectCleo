'use client'

import { AdherenceFlag, AnalysisResult, DrugInteraction, Medication } from '@/lib/types'

const SEVERITY_CARD: Record<string, string> = {
  mild: 'bg-yellow-50 border-yellow-200',
  moderate: 'bg-orange-50 border-orange-200',
  severe: 'bg-red-50 border-red-200',
}

const SEVERITY_BADGE: Record<string, string> = {
  mild: 'bg-yellow-100 text-yellow-800',
  moderate: 'bg-orange-100 text-orange-800',
  severe: 'bg-red-100 text-red-800',
}

const ADHERENCE_CATEGORY_STYLES: Record<string, string> = {
  cost: 'bg-red-50 border-red-100 text-red-800',
  forgetting: 'bg-orange-50 border-orange-100 text-orange-800',
  'side-effects': 'bg-yellow-50 border-yellow-100 text-yellow-800',
  avoidance: 'bg-purple-50 border-purple-100 text-purple-800',
  other: 'bg-slate-50 border-slate-200 text-slate-700',
}

const ADHERENCE_LABELS: Record<string, string> = {
  cost: 'Cost barrier',
  forgetting: 'Adherence / forgetting',
  'side-effects': 'Side effect concern',
  avoidance: 'Avoidance',
  other: 'Adherence flag',
}

export default function RecommendationOutput({
  medications,
  result,
}: {
  medications: Medication[]
  result: AnalysisResult
}) {
  return (
    <div className="space-y-4">
      {/* MindMetrix-informed insight */}
      {result.mindMetrixSummary && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex gap-3 shadow-sm">
          <div className="shrink-0 mt-0.5">
            <div className="w-5 h-5 rounded bg-teal-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-1">
              MindMetrix Assessment Findings
            </p>
            <p className="text-sm text-teal-900 leading-relaxed">{result.mindMetrixSummary}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm">
        <span className="text-amber-500 text-base leading-tight shrink-0 mt-0.5">⚠</span>
        <p className="text-sm text-amber-800 leading-relaxed">{result.disclaimer}</p>
      </div>

      {/* Adherence flags */}
      {result.adherenceFlags?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Adherence Signals</h3>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              {result.adherenceFlags.length} detected
            </span>
          </div>
          <div className="space-y-2">
            {result.adherenceFlags.map((flag: AdherenceFlag, i: number) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${ADHERENCE_CATEGORY_STYLES[flag.category] ?? ADHERENCE_CATEGORY_STYLES.other}`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1 opacity-70">
                  {ADHERENCE_LABELS[flag.category] ?? 'Flag'}
                </p>
                <p className="text-sm leading-snug">{flag.signal}</p>
                {flag.quote && (
                  <p className="text-xs italic mt-1 opacity-60">"{flag.quote}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      {medications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Medications Identified</h3>
          <div className="flex flex-wrap gap-2">
            {medications.map((med, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 text-sm px-3 py-1.5 rounded-full border border-indigo-100"
              >
                <span className="font-semibold capitalize">{med.name}</span>
                {med.dose && <span className="text-indigo-500 text-xs">{med.dose}</span>}
                {med.frequency && <span className="text-indigo-400 text-xs">{med.frequency}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical summary */}
      {result.summary && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Clinical Summary</h3>
          <p className="text-slate-600 leading-relaxed text-sm">{result.summary}</p>
        </div>
      )}

      {/* Drug interactions */}
      {result.interactions?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-800">FDA Interaction Alerts</h3>
            <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              {result.interactions.length} flagged
            </span>
          </div>
          <div className="space-y-2.5">
            {result.interactions.map((interaction: DrugInteraction, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${SEVERITY_CARD[interaction.severity] ?? SEVERITY_CARD.mild}`}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-semibold text-sm capitalize">{interaction.drug1}</span>
                  <span className="text-slate-400 text-xs">×</span>
                  <span className="font-semibold text-sm capitalize">{interaction.drug2}</span>
                  <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-semibold ${SEVERITY_BADGE[interaction.severity] ?? SEVERITY_BADGE.mild}`}>
                    {interaction.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-snug">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Prescriber Recommendations</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
