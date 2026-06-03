'use client'

import { useState } from 'react'
import { Patient, Visit } from '@/lib/types'
import { createPatient } from '@/lib/storage'

interface Props {
  patients: Patient[]
  selected: Patient | null
  insurancePlan: string
  onSelect: (patient: Patient | null) => void
  onInsuranceChange: (plan: string) => void
  onPatientsChange: (patients: Patient[]) => void
}

export default function PatientPanel({
  patients,
  selected,
  insurancePlan,
  onSelect,
  onInsuranceChange,
  onPatientsChange,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (!newName.trim()) return
    const patient = createPatient(newName.trim(), insurancePlan || undefined)
    onPatientsChange([patient, ...patients])
    onSelect(patient)
    setNewName('')
    setAdding(false)
  }

  const lastVisit: Visit | null = selected?.visits[0] ?? null

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Patient</h3>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            + New patient
          </button>
        )}
      </div>

      {adding ? (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Patient name or initials"
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="bg-blue-600 disabled:opacity-40 text-white text-sm px-3 py-2 rounded-lg font-medium"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setNewName('') }}
            className="text-sm text-slate-400 px-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <select
          value={selected?.id ?? ''}
          onChange={(e) => {
            const p = patients.find((p) => p.id === e.target.value) ?? null
            onSelect(p)
            if (p?.insurance) onInsuranceChange(p.insurance)
          }}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">— No patient selected —</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.visits.length > 0 ? ` (${p.visits.length} visit${p.visits.length !== 1 ? 's' : ''})` : ''}
            </option>
          ))}
        </select>
      )}

      <div>
        <label className="block text-xs text-slate-500 mb-1">Insurance plan (for formulary check)</label>
        <input
          type="text"
          value={insurancePlan}
          onChange={(e) => onInsuranceChange(e.target.value)}
          placeholder="e.g. Aetna HMO, Medicare Part D, BCBS PPO"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {lastVisit && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-800 mb-1">
            Last visit: {lastVisit.date}
          </p>
          <p className="text-xs text-blue-700">
            {lastVisit.result.recommendations.length} open recommendation{lastVisit.result.recommendations.length !== 1 ? 's' : ''} •{' '}
            {lastVisit.medications.map((m) => m.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
