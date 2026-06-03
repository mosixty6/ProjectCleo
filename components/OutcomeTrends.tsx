'use client'

import { Visit } from '@/lib/types'

const SCORE_BG: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-emerald-400',
  5: 'bg-emerald-600',
}

const DIRECTION_ICON: Record<string, string> = {
  improving: '↑',
  worsening: '↓',
  stable: '→',
  unknown: '',
}

export default function OutcomeTrends({ visits }: { visits: Visit[] }) {
  // Collect all symptom names across visits (most recent first)
  const recentVisits = visits.slice(0, 5).reverse() // oldest→newest for trend direction
  const allSymptoms = Array.from(
    new Set(recentVisits.flatMap((v) => (v.result.symptomScores ?? []).map((s) => s.symptom)))
  )

  if (allSymptoms.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-1">Symptom Trends</h3>
      <p className="text-xs text-slate-400 mb-4">Across {recentVisits.length} visit{recentVisits.length !== 1 ? 's' : ''} — score 1 (severe) → 5 (minimal)</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4 w-28">Symptom</th>
              {recentVisits.map((v) => (
                <th key={v.id} className="text-center text-xs text-slate-400 font-normal pb-2 px-2 min-w-[60px]">
                  {v.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allSymptoms.map((symptom) => (
              <tr key={symptom}>
                <td className="py-2 pr-4 text-xs font-medium text-slate-600 capitalize">{symptom}</td>
                {recentVisits.map((v) => {
                  const s = (v.result.symptomScores ?? []).find((x) => x.symptom === symptom)
                  if (!s) return <td key={v.id} className="py-2 px-2 text-center"><span className="text-slate-200 text-xs">—</span></td>
                  return (
                    <td key={v.id} className="py-2 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-block w-7 h-7 rounded-full ${SCORE_BG[s.score] ?? 'bg-slate-200'} text-white text-xs font-bold flex items-center justify-center leading-none`}>
                          {s.score}
                        </span>
                        {s.direction && s.direction !== 'unknown' && (
                          <span className={`text-xs ${s.direction === 'improving' ? 'text-emerald-500' : s.direction === 'worsening' ? 'text-red-500' : 'text-slate-400'}`}>
                            {DIRECTION_ICON[s.direction]}
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
