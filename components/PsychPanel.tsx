'use client'

import { useState } from 'react'
import { DetectedScale, DSMDiagnosis, MedProtocol, PsychAssessment } from '@/lib/types'

type Tab = 'dx' | 'rx' | 'scales' | 'billing'

export default function PsychPanel({ assessment }: { assessment: PsychAssessment }) {
  const [activeTab, setActiveTab] = useState<Tab>('dx')

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'dx', label: 'Diagnoses', count: assessment.diagnoses.length },
    { id: 'rx', label: 'Protocols', count: assessment.protocols.length },
    { id: 'scales', label: 'Scales & Labs', count: assessment.detectedScales.length + assessment.labsRequired.length },
    { id: 'billing', label: 'Billing' },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 pt-5 pb-0 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Psychiatric Assessment</h3>
            <p className="text-xs text-slate-500 mt-0.5">DSM-5-TR · APA Guidelines · Evidence-Based Protocols</p>
          </div>
          <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-100 font-medium">
            Psych Engine
          </span>
        </div>

        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-4 py-2 font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  activeTab === tab.id ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'dx' && <DiagnosesTab assessment={assessment} />}
        {activeTab === 'rx' && <ProtocolsTab protocols={assessment.protocols} />}
        {activeTab === 'scales' && <ScalesLabsTab assessment={assessment} />}
        {activeTab === 'billing' && <BillingTab cptCodes={assessment.cptCodes} />}
      </div>
    </div>
  )
}

function DiagnosesTab({ assessment }: { assessment: PsychAssessment }) {
  if (assessment.diagnoses.length === 0) {
    return <p className="text-sm text-slate-400 italic">No diagnoses extracted from this transcript.</p>
  }

  return (
    <div className="space-y-4">
      {assessment.treatmentResistance && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2.5">
          <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Treatment Resistance Flag</p>
            <p className="text-xs text-amber-700">{assessment.treatmentResistance}</p>
          </div>
        </div>
      )}

      {assessment.diagnoses.map((dx, i) => (
        <DiagnosisCard key={i} dx={dx} />
      ))}
    </div>
  )
}

function DiagnosisCard({ dx }: { dx: DSMDiagnosis }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{dx.name}</p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{dx.icd10}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ConfidenceBadge confidence={dx.confidence} />
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && dx.criteriaEvidence.length > 0 && (
        <div className="px-4 pb-3 border-t border-slate-50 bg-slate-50">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-2.5 mb-1.5">Criteria Evidence</p>
          <ul className="space-y-1">
            {dx.criteriaEvidence.map((ev, j) => (
              <li key={j} className="text-xs text-slate-600 flex gap-1.5">
                <span className="text-slate-300 shrink-0 mt-0.5">›</span>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ConfidenceBadge({ confidence }: { confidence: DSMDiagnosis['confidence'] }) {
  const styles = {
    high: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    moderate: 'bg-amber-50 text-amber-700 border-amber-100',
    low: 'bg-rose-50 text-rose-700 border-rose-100',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${styles[confidence]}`}>
      {confidence}
    </span>
  )
}

function ProtocolsTab({ protocols }: { protocols: MedProtocol[] }) {
  if (protocols.length === 0) {
    return <p className="text-sm text-slate-400 italic">No medication protocols generated.</p>
  }

  return (
    <div className="space-y-4">
      {protocols.map((p, i) => (
        <ProtocolCard key={i} protocol={p} />
      ))}
    </div>
  )
}

function ProtocolCard({ protocol: p }: { protocol: MedProtocol }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 capitalize">{p.medication}</p>
          <p className="text-xs text-slate-500 mt-0.5">{p.indication}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <DoseStatusBadge status={p.doseStatus} />
          <LineBadge line={p.lineOfTreatment} />
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 bg-slate-50 space-y-3">
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white border border-slate-100 rounded-md p-2.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Current Dose</p>
              <p className="text-xs text-slate-800">{p.currentDose}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-md p-2.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Target Range</p>
              <p className="text-xs text-slate-800">{p.targetDoseRange}</p>
            </div>
          </div>

          {p.titrationNote && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Titration Guidance</p>
              <p className="text-xs text-slate-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">{p.titrationNote}</p>
            </div>
          )}

          {p.monitoringRequired.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Monitoring Required</p>
              <div className="flex flex-wrap gap-1.5">
                {p.monitoringRequired.map((m, j) => (
                  <span key={j} className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">{m}</span>
                ))}
              </div>
            </div>
          )}

          {p.commonSideEffects.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Counsel On (Side Effects)</p>
              <div className="flex flex-wrap gap-1.5">
                {p.commonSideEffects.map((s, j) => (
                  <span key={j} className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DoseStatusBadge({ status }: { status: MedProtocol['doseStatus'] }) {
  const config: Record<MedProtocol['doseStatus'], { style: string; label: string }> = {
    'sub-therapeutic': { style: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Sub-therapeutic' },
    'therapeutic': { style: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Therapeutic' },
    'above-guideline': { style: 'bg-rose-50 text-rose-700 border-rose-100', label: 'Above guideline' },
    'unknown': { style: 'bg-slate-50 text-slate-500 border-slate-200', label: 'Dose unknown' },
  }
  const { style, label } = config[status]
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${style}`}>
      {label}
    </span>
  )
}

function LineBadge({ line }: { line: MedProtocol['lineOfTreatment'] }) {
  const config: Record<MedProtocol['lineOfTreatment'], { style: string; label: string }> = {
    '1st': { style: 'bg-blue-50 text-blue-700 border-blue-100', label: '1st-line' },
    '2nd': { style: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: '2nd-line' },
    '3rd': { style: 'bg-violet-50 text-violet-700 border-violet-100', label: '3rd-line' },
    'augmentation': { style: 'bg-cyan-50 text-cyan-700 border-cyan-100', label: 'Augment' },
  }
  const { style, label } = config[line]
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${style}`}>
      {label}
    </span>
  )
}

function ScalesLabsTab({ assessment }: { assessment: PsychAssessment }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Rating Scales Detected</h4>
        {assessment.detectedScales.length > 0 ? (
          <div className="space-y-2">
            {assessment.detectedScales.map((scale, i) => (
              <ScaleCard key={i} scale={scale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-400">No rating scale scores detected in transcript.</p>
            <p className="text-[10px] text-slate-300 mt-1">Scores are extracted when explicitly mentioned (e.g. "PHQ-9 was 14")</p>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Lab Monitoring Checklist</h4>
        {assessment.labsRequired.length > 0 ? (
          <ul className="space-y-2">
            {assessment.labsRequired.map((lab, i) => (
              <LabCheckItem key={i} lab={lab} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-400">No labs flagged for current regimen.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ScaleCard({ scale }: { scale: DetectedScale }) {
  return (
    <div className="border border-slate-100 rounded-lg p-3 flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-slate-900">{scale.scale}</span>
          <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
            {scale.score}
          </span>
          <SeverityBadge severity={scale.severity} />
        </div>
        <p className="text-xs text-slate-500">{scale.interpretation}</p>
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity.toLowerCase()
  if (s.includes('severe') || s.includes('high') || s.includes('extreme')) {
    return <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{severity}</span>
  }
  if (s.includes('moderate') || s.includes('medium')) {
    return <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{severity}</span>
  }
  if (s.includes('mild') || s.includes('low') || s.includes('minimal') || s.includes('none')) {
    return <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{severity}</span>
  }
  return <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{severity}</span>
}

function LabCheckItem({ lab }: { lab: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <li className="flex items-start gap-2.5">
      <button
        onClick={() => setChecked((v) => !v)}
        className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
          checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`text-xs transition-colors ${checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>{lab}</span>
    </li>
  )
}

function BillingTab({ cptCodes }: { cptCodes: PsychAssessment['cptCodes'] }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const lines = [
      `${cptCodes.primary} — ${cptCodes.description}`,
      ...cptCodes.addOns,
    ].join('\n')
    navigator.clipboard.writeText(lines).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!cptCodes.primary) {
    return <p className="text-sm text-slate-400 italic">CPT code suggestion not available for this encounter.</p>
  }

  return (
    <div className="space-y-4">
      <div className="border border-slate-100 rounded-lg p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Primary Code</p>
          <button
            onClick={copy}
            className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md transition-colors"
          >
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl font-bold text-slate-900 tabular-nums">{cptCodes.primary}</span>
          <span className="text-sm text-slate-600">{cptCodes.description}</span>
        </div>

        {cptCodes.rationale && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2 mt-2">{cptCodes.rationale}</p>
        )}
      </div>

      {cptCodes.addOns.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Add-On Codes</p>
          <ul className="space-y-1.5">
            {cptCodes.addOns.map((code, i) => (
              <li key={i} className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-md px-3 py-2">{code}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-slate-400 bg-slate-50 rounded-md px-3 py-2">
        CPT suggestions are for reference only. Verify with your billing specialist. Documentation must support the level of service coded.
      </p>
    </div>
  )
}
