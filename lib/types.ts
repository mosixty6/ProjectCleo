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

export interface AgentStepState {
  id: 'extract' | 'openfda' | 'synthesize'
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  detail?: string
}

export interface AnalysisResult {
  summary: string
  recommendations: string[]
  interactions: DrugInteraction[]
  followUpQuestions: string[]
  disclaimer: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
