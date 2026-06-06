'use client'

import { useEffect, useState } from 'react'
import AgentSteps from '@/components/AgentSteps'
import RecommendationOutput from '@/components/RecommendationOutput'
import FollowUpChat from '@/components/FollowUpChat'
import PatientPanel from '@/components/PatientPanel'
import FormularyResults from '@/components/FormularyResults'
import BerriesNotePanel from '@/components/BerriesNotePanel'
import OutcomeTrends from '@/components/OutcomeTrends'
import NextVisitPrep from '@/components/NextVisitPrep'
import CouncilPanel from '@/components/CouncilPanel'
import PsychNoteTemplate from '@/components/PsychNoteTemplate'
import { AgentStepState, AnalysisResult, FormularyResult, Medication, Patient, Visit } from '@/lib/types'
import { addVisit, getPatient, getPatients } from '@/lib/storage'

const INITIAL_STEPS: AgentStepState[] = [
  { id: 'extract', label: '', status: 'pending' },
  { id: 'formulary', label: '', status: 'pending' },
  { id: 'openfda', label: '', status: 'pending' },
  { id: 'synthesize', label: '', status: 'pending' },
  { id: 'note', label: '', status: 'pending' },
]

export default function Home() {
  // Patient
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [insurancePlan, setInsurancePlan] = useState('')

  // Transcript
  const [transcript, setTranscript] = useState('')

  // Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [steps, setSteps] = useState<AgentStepState[]>(INITIAL_STEPS)
  const [medications, setMedications] = useState<Medication[]>([])
  const [formulary, setFormulary] = useState<FormularyResult | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [berriesNote, setBerriesNote] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // PA drafts
  const [draftingPA, setDraftingPA] = useState<string | null>(null)
  const [paDrafts, setPaDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    setPatients(getPatients())
  }, [])

  const updateStep = (id: string, updates: Partial<AgentStepState>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))

  const handleEvent = (event: { step: string; status: string; data?: unknown; error?: string }) => {
    if (event.step === 'extract') {
      if (event.status === 'running') updateStep('extract', { status: 'running' })
      else if (event.status === 'done') {
        const { medications: meds = [] } = event.data as { medications: Medication[] }
        setMedications(meds)
        updateStep('extract', { status: 'done', detail: `Found ${meds.length} medication${meds.length !== 1 ? 's' : ''}` })
      }
    }
    if (event.step === 'formulary') {
      if (event.status === 'running') updateStep('formulary', { status: 'running' })
      else if (event.status === 'done') {
        const f = event.data as FormularyResult
        setFormulary(f)
        const paCount = f.paRequired?.length ?? 0
        updateStep('formulary', { status: 'done', detail: paCount > 0 ? `${paCount} PA required` : 'All medications covered' })
      } else if (event.status === 'skipped') {
        updateStep('formulary', { status: 'skipped', detail: 'No insurance plan provided' })
      }
    }
    if (event.step === 'openfda') {
      if (event.status === 'running') updateStep('openfda', { status: 'running' })
      else if (event.status === 'done') {
        const { found = 0 } = event.data as { found: number }
        updateStep('openfda', { status: 'done', detail: `FDA data for ${found} medication${found !== 1 ? 's' : ''}` })
      }
    }
    if (event.step === 'synthesize') {
      if (event.status === 'running') updateStep('synthesize', { status: 'running' })
      else if (event.status === 'done') {
        setResult(event.data as AnalysisResult)
        updateStep('synthesize', { status: 'done', detail: 'Recommendations ready' })
      }
    }
    if (event.step === 'note') {
      if (event.status === 'running') updateStep('note', { status: 'running' })
      else if (event.status === 'done') {
        const { note = '' } = event.data as { note: string }
        setBerriesNote(note)
        updateStep('note', { status: 'done', detail: 'Ready to paste' })
      }
    }
    if (event.step === 'error') setError(event.error ?? 'Analysis failed')
  }

  const runAnalysis = async () => {
    if (!transcript.trim()) return
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setFormulary(null)
    setMedications([])
    setBerriesNote('')
    setPaDrafts({})
    setSteps(INITIAL_STEPS)

    const previousVisit = selectedPatient
      ? (getPatient(selectedPatient.id)?.visits[0] ?? null)
      : null

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, insurancePlan, previousVisit }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let finalResult: AnalysisResult | null = null
      let finalMeds: Medication[] = []
      let finalFormulary: FormularyResult | null = null
      let finalNote = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            handleEvent(event)
            if (event.step === 'extract' && event.status === 'done')
              finalMeds = (event.data as { medications: Medication[] }).medications
            if (event.step === 'formulary' && event.status === 'done')
              finalFormulary = event.data as FormularyResult
            if (event.step === 'synthesize' && event.status === 'done')
              finalResult = event.data as AnalysisResult
            if (event.step === 'note' && event.status === 'done')
              finalNote = (event.data as { note: string }).note
          } catch {
            // skip malformed events
          }
        }
      }

      if (selectedPatient && finalResult) {
        const visit: Visit = {
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString(),
          medications: finalMeds,
          result: finalResult,
          formulary: finalFormulary ?? undefined,
          berriesNote: finalNote,
        }
        addVisit(selectedPatient.id, visit)
        const updated = getPatients()
        setPatients(updated)
        setSelectedPatient(updated.find((p) => p.id === selectedPatient.id) ?? null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const draftPA = async (medication: string) => {
    if (!result) return
    setDraftingPA(medication)
    try {
      const res = await fetch('/api/draft-pa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication,
          diagnosis: result.summary,
          clinicalJustification: result.recommendations.join('; '),
        }),
      })
      const data = await res.json()
      setPaDrafts((prev) => ({ ...prev, [medication]: data.letter }))
    } finally {
      setDraftingPA(null)
    }
  }

  const wordCount = transcript.split(/\s+/).filter(Boolean).length
  const showSteps = isAnalyzing || result !== null || error !== null
  const patientVisits = selectedPatient?.visits ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cleo</h1>
            <p className="text-xs text-slate-500">Clinical Decision Support</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 font-medium">
            Prescriber Support Only
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Patient + insurance */}
        <PatientPanel
          patients={patients}
          selected={selectedPatient}
          insurancePlan={insurancePlan}
          onSelect={setSelectedPatient}
          onInsuranceChange={setInsurancePlan}
          onPatientsChange={setPatients}
        />

        {/* Outcome trends — shows if patient has 2+ visits */}
        {patientVisits.length >= 2 && (
          <OutcomeTrends visits={patientVisits} />
        )}

        {/* Next visit prep from last visit — surfaces at top before new analysis */}
        {!result && patientVisits[0]?.result?.nextVisitPrep && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
              Carry-over from last visit ({patientVisits[0].date})
            </p>
            <NextVisitPrep prep={patientVisits[0].result.nextVisitPrep} />
          </div>
        )}

        {/* Psych note template */}
        <PsychNoteTemplate />

        {/* Transcript */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 block mb-1">Paste Transcript</span>
            <span className="text-xs text-slate-400 block mb-3">
              Export from Berries or paste clinical encounter notes
            </span>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your clinical transcript here..."
              rows={9}
              className="w-full text-sm border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-300"
            />
          </label>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {transcript.length > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'No transcript pasted'}
            </span>
            <button
              onClick={runAnalysis}
              disabled={!transcript.trim() || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <span className="text-red-500 shrink-0 font-bold">✕</span>
            <div>
              <p className="text-sm font-medium text-red-800">Analysis failed</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {showSteps && <AgentSteps steps={steps} />}

        {formulary && result && (
          <FormularyResults
            formulary={formulary}
            result={result}
            onDraftPA={draftPA}
            draftingPA={draftingPA}
            paDrafts={paDrafts}
          />
        )}

        {result && <RecommendationOutput medications={medications} result={result} />}

        {result && (
          <CouncilPanel
            transcript={transcript}
            medications={medications}
            result={result}
          />
        )}

        {berriesNote && <BerriesNotePanel note={berriesNote} />}

        {/* Next visit prep from current analysis */}
        {result?.nextVisitPrep && <NextVisitPrep prep={result.nextVisitPrep} />}

        {result && (
          <FollowUpChat
            analysisContext={{ medications, result }}
            suggestedQuestions={result.followUpQuestions ?? []}
          />
        )}
      </main>
    </div>
  )
}
