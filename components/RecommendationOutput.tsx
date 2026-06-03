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
  forgetting: 'Adherence/forgetting',
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
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-amber-500 text-lg leading-tight shrink-0">⚠</span>
        <p className="text-sm text-amber-800 leading-relaxed">{result.disclaimer}</p>
      </div>

      {/* Adherence flags */}
      {result.adherenceFlags?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">
            Adherence Signals
            <span className="ml-2 text-xs font-normal text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              {result.adherenceFlags.length} detected
            </span>
          </h3>
          <div className="space-y-2.5">
            {result.adherenceFlags.map((flag: AdherenceFlag, i: number) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${ADHERENCE_CATEGORY_STYLES[flag.category] ?? ADHERENCE_CATEGORY_STYLES.other}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {ADHERENCE_LABELS[flag.category] ?? 'Flag'}
                  </span>
                </div>
                <p className="text-sm">{flag.signal}</p>
                {flag.quote && (
                  <p className="text-xs italic mt-1 opacity-70">"{flag.quote}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications identified */}
      {medications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Medications Identified</h3>
          <div className="flex flex-wrap gap-2">
            {medications.map((med, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-sm px-3 py-1.5 rounded-full border border-blue-100"
              >
                <span className="font-medium capitalize">{med.name}</span>
                {med.dose && <span className="text-blue-600">{med.dose}</span>}
                {med.frequency && <span className="text-blue-500 text-xs">{med.frequency}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical summary */}
      {result.summary && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-2">Clinical Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm">{result.summary}</p>
        </div>
      )}

      {/* Drug interactions */}
      {result.interactions?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">
            FDA Interaction Alerts
            <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              {result.interactions.length} flagged
            </span>
          </h3>
          <div className="space-y-3">
            {result.interactions.map((interaction: DrugInteraction, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${SEVERITY_CARD[interaction.severity] ?? SEVERITY_CARD.mild}`}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-medium text-sm capitalize">{interaction.drug1}</span>
                  <span className="text-slate-400 text-xs">×</span>
                  <span className="font-medium text-sm capitalize">{interaction.drug2}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_BADGE[interaction.severity] ?? SEVERITY_BADGE.mild}`}>
                    {interaction.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Recommendations for Prescriber Review</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
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
