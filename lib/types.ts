export interface Medication {
  name: string
  dose?: string
  frequency?: string
}

export interface DrugInteraction {
  drug1: string
  drug2: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
}

export type AgentStepId = 'extract' | 'formulary' | 'openfda' | 'synthesize' | 'note'

export interface AgentStepState {
  id: AgentStepId
  label: string
  status: 'pending' | 'running' | 'done' | 'skipped' | 'error'
  detail?: string
}

export interface FormularyItem {
  name: string
  tier?: string
  status: 'covered' | 'non-preferred' | 'pa-required' | 'not-covered' | 'unknown'
  notes?: string
  estimatedCost?: string
  genericAlternative?: string
}

export interface FormularyResult {
  plan: string
  items: FormularyItem[]
  paRequired: string[]
}

export interface AdherenceFlag {
  signal: string
  quote?: string
  category: 'cost' | 'forgetting' | 'side-effects' | 'avoidance' | 'other'
}

export interface SymptomScore {
  symptom: string
  score: number
  direction: 'improving' | 'stable' | 'worsening' | 'unknown'
}

export interface NextVisitPrep {
  timeframe: string
  expectedOutcomes: string[]
  assessmentItems: string[]
  decisionPoints: string[]
}

export interface MindMetrixConditionScore {
  condition: string
  domain: 'mood' | 'anxiety' | 'trauma' | 'adhd' | 'substance' | 'psychosis' | 'personality' | 'other'
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  flag: boolean
}

export interface MindMetrixAssessment {
  assessmentId?: string
  completedDate: string
  conditionScores: MindMetrixConditionScore[]
  topFlags: string[]
  notes?: string
}

export interface AnalysisResult {
  summary: string
  recommendations: string[]
  interactions: DrugInteraction[]
  adherenceFlags: AdherenceFlag[]
  symptomScores: SymptomScore[]
  nextVisitPrep: NextVisitPrep | null
  followUpQuestions: string[]
  disclaimer: string
  mindMetrixSummary?: string
}

export interface PADraft {
  medication: string
  letter: string
}

export interface Visit {
  id: string
  date: string
  medications: Medication[]
  result: AnalysisResult
  formulary?: FormularyResult
  berriesNote?: string
  mindMetrix?: MindMetrixAssessment
}

export interface Patient {
  id: string
  name: string
  insurance?: string
  visits: Visit[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
