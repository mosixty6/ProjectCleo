'use client'

import { AgentStepState } from '@/lib/types'

const STEP_LABELS: Record<string, string> = {
  extract: 'Extracting medications',
  formulary: 'Checking formulary coverage',
  openfda: 'FDA interaction database',
  synthesize: 'Generating recommendations',
  note: 'Drafting EHR note',
}

interface Props {
  steps: AgentStepState[]
  hasMindMetrix?: boolean
}

export default function AgentSteps({ steps, hasMindMetrix = false }: Props) {
  const getLabel = (id: string) => {
    if (id === 'synthesize' && hasMindMetrix) return 'Synthesizing with MindMetrix'
    return STEP_LABELS[id] ?? id
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Analysis Progress
      </p>
      <div className="space-y-3.5">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            <StepIcon status={step.status} isMindMetrix={step.id === 'synthesize' && hasMindMetrix} />
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-xs font-medium leading-tight ${
                step.status === 'pending' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {getLabel(step.id)}
              </p>
              {step.detail && (
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepIcon({ status, isMindMetrix }: { status: AgentStepState['status']; isMindMetrix: boolean }) {
  if (status === 'pending') {
    return <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
  }
  if (status === 'running') {
    const color = isMindMetrix ? 'border-teal-500' : 'border-indigo-500'
    return <div className={`mt-0.5 w-5 h-5 rounded-full border-2 ${color} border-t-transparent animate-spin shrink-0`} />
  }
  if (status === 'done') {
    const bg = isMindMetrix ? 'bg-teal-500' : 'bg-emerald-500'
    return (
      <div className={`mt-0.5 w-5 h-5 rounded-full ${bg} flex items-center justify-center shrink-0`}>
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
