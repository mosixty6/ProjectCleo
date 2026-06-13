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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Patient</h3>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            + New
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
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="bg-indigo-600 disabled:opacity-40 text-white text-sm px-3 py-2 rounded-lg font-semibold"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setNewName('') }}
            className="text-sm text-slate-400 hover:text-slate-600 px-2"
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
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
        >
          <option value="">— No patient selected —</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.visits.length > 0 ? ` · ${p.visits.length} visit${p.visits.length !== 1 ? 's' : ''}` : ''}
            </option>
          ))}
        </select>
      )}

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          Insurance plan
        </label>
        <input
          type="text"
          value={insurancePlan}
          onChange={(e) => onInsuranceChange(e.target.value)}
          placeholder="e.g. Aetna HMO, Medicare Part D"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 placeholder-slate-300"
        />
      </div>

      {lastVisit && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide mb-1">
            Last visit · {lastVisit.date}
          </p>
          <p className="text-xs text-indigo-700 leading-snug">
            {lastVisit.result.recommendations.length} recommendation{lastVisit.result.recommendations.length !== 1 ? 's' : ''}
            {lastVisit.medications.length > 0 && (
              <span className="text-indigo-500"> · {lastVisit.medications.map((m) => m.name).join(', ')}</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
