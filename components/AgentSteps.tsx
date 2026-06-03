'use client'

import { AgentStepState } from '@/lib/types'

const STEP_LABELS: Record<string, string> = {
  extract: 'Extracting medications from transcript',
  formulary: 'Checking formulary',
  openfda: 'Checking FDA interaction database',
  synthesize: 'Generating clinical recommendations',
  note: 'Drafting Berries note',
}

export default function AgentSteps({ steps }: { steps: AgentStepState[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Analysis Progress
      </h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            <StepIcon status={step.status} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                step.status === 'pending' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {STEP_LABELS[step.id]}
              </p>
              {step.detail && (
                <p className="text-xs text-slate-500 mt-0.5">{step.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepIcon({ status }: { status: AgentStepState['status'] }) {
  if (status === 'pending') {
    return <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
  }
  if (status === 'running') {
    return <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
  }
  if (status === 'done') {
    return (
      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (status === 'skipped') {
    return (
      <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center shrink-0">
        <div className="w-1.5 h-0.5 bg-slate-300 rounded" />
      </div>
    )
  }
  return (
    <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
      <span className="text-white text-xs font-bold leading-none">!</span>
    </div>
  )
}
