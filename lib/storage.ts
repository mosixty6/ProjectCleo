import { Patient, Visit } from './types'

const KEY = 'cleo_patients'

export function getPatients(): Patient[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(patients: Patient[]) {
  localStorage.setItem(KEY, JSON.stringify(patients))
}

export function getPatient(id: string): Patient | null {
  return getPatients().find((p) => p.id === id) ?? null
}

export function createPatient(name: string, insurance?: string): Patient {
  const patient: Patient = { id: crypto.randomUUID(), name, insurance, visits: [] }
  const all = getPatients()
  all.unshift(patient)
  save(all)
  return patient
}

export function updatePatientInsurance(id: string, insurance: string) {
  save(getPatients().map((p) => (p.id === id ? { ...p, insurance } : p)))
}

export function addVisit(patientId: string, visit: Visit) {
  save(
    getPatients().map((p) =>
      p.id === patientId ? { ...p, visits: [visit, ...p.visits] } : p
    )
  )
}

export function getLastVisit(patientId: string): Visit | null {
  return getPatient(patientId)?.visits[0] ?? null
}
