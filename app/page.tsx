'use client'

import { useState } from 'react'
import AgentSteps from '@/components/AgentSteps'
import RecommendationOutput from '@/components/RecommendationOutput'
import FollowUpChat from '@/components/FollowUpChat'
import { AgentStepState, AnalysisResult, Medication } from '@/lib/types'

const INITIAL_STEPS: AgentStepState[] = [
  { id: 'extract', label: 'Extracting medications', status: 'pending' },
  { id: 'openfda', label: 'Checking FDA database', status: 'pending' },
  { id: 'synthesize', label: 'Generating recommendations', status: 'pending' },
]

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [steps, setSteps] = useState<AgentStepState[]>(INITIAL_STEPS)
  const [medications, setMedications] = useState<Medication[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateStep = (id: string, updates: Partial<AgentStepState>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const handleEvent = (event: { step: string; status: string; data?: unknown; error?: string }) => {
    if (event.step === 'extract') {
      if (event.status === 'running') updateStep('extract', { status: 'running' })
      else if (event.status === 'done') {
        const { medications: meds = [] } = event.data as { medications: Medication[] }
        setMedications(meds)
        updateStep('extract', {
          status: 'done',
          detail: `Found ${meds.length} medication${meds.length !== 1 ? 's' : ''}`,
        })
      }
    }
    if (event.step === 'openfda') {
      if (event.status === 'running') updateStep('openfda', { status: 'running' })
      else if (event.status === 'done') {
        const { found = 0 } = event.data as { found: number }
        updateStep('openfda', {
          status: 'done',
          detail: `FDA data retrieved for ${found} medication${found !== 1 ? 's' : ''}`,
        })
      }
    }
    if (event.step === 'synthesize') {
      if (event.status === 'running') updateStep('synthesize', { status: 'running' })
      else if (event.status === 'done') {
        setResult(event.data as AnalysisResult)
        updateStep('synthesize', { status: 'done', detail: 'Recommendations ready' })
      }
    }
    if (event.step === 'error') {
      setError(event.error ?? 'Analysis failed')
    }
  }

  const runAnalysis = async () => {
    if (!transcript.trim()) return
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setMedications([])
    setSteps(INITIAL_STEPS)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            handleEvent(JSON.parse(line.slice(6)))
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const showSteps = isAnalyzing || result !== null || error !== null
  const wordCount = transcript.split(/\s+/).filter(Boolean).length

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
        {/* Transcript input */}
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

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <span className="text-red-500 shrink-0 font-bold">✕</span>
            <div>
              <p className="text-sm font-medium text-red-800">Analysis failed</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Agent steps */}
        {showSteps && <AgentSteps steps={steps} />}

        {/* Results */}
        {result && <RecommendationOutput medications={medications} result={result} />}

        {/* Follow-up chat */}
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
