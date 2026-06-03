'use client'

import { NextVisitPrep as NextVisitPrepType } from '@/lib/types'

export default function NextVisitPrep({ prep }: { prep: NextVisitPrepType }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Next Visit Prep</h3>
        {prep.timeframe && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
            ~{prep.timeframe}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {prep.expectedOutcomes?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">What to expect</p>
            <ul className="space-y-1.5">
              {prep.expectedOutcomes.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-blue-400 shrink-0 mt-0.5">◦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {prep.assessmentItems?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Assess at next visit</p>
            <div className="flex flex-wrap gap-2">
              {prep.assessmentItems.map((item, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {prep.decisionPoints?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Decision points</p>
            <ul className="space-y-1.5">
              {prep.decisionPoints.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-amber-400 shrink-0 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
