'use client'

import { useState } from 'react'

// --- chip helpers ---
function Chip({
  label,
  selected,
  onClick,
  color = 'blue',
}: {
  label: string
  selected: boolean
  onClick: () => void
  color?: 'blue' | 'red' | 'green' | 'amber' | 'slate'
}) {
  const palette = {
    blue: selected
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700',
    red: selected
      ? 'bg-red-600 text-white border-red-600'
      : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-700',
    green: selected
      ? 'bg-emerald-600 text-white border-emerald-600'
      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700',
    amber: selected
      ? 'bg-amber-500 text-white border-amber-500'
      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700',
    slate: selected
      ? 'bg-slate-700 text-white border-slate-700'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800',
  }
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${palette[color]}`}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
      {children}
    </div>
  )
}

function ChipGroup({
  options,
  selected,
  onToggle,
  multi = true,
  color = 'blue',
}: {
  options: string[]
  selected: Set<string>
  onToggle: (v: string) => void
  multi?: boolean
  color?: 'blue' | 'red' | 'green' | 'amber' | 'slate'
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} label={o} selected={selected.has(o)} onClick={() => onToggle(o)} color={color} />
      ))}
    </div>
  )
}

function useChips(initial: string[] = [], multi = true) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial))
  const toggle = (v: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(v)) {
        next.delete(v)
      } else {
        if (!multi) next.clear()
        next.add(v)
      }
      return next
    })
  return { selected, toggle }
}

// --- main component ---
export default function PsychNoteTemplate() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // visit meta
  const visitType = useChips([], false)
  const chiefComplaint = useChips([], true)

  // interval history
  const interval = useChips([], true)

  // MSE
  const appearance = useChips([], true)
  const behavior = useChips([], true)
  const speech = useChips([], true)
  const mood = useChips([], true)
  const affect = useChips([], true)
  const thoughtProcess = useChips([], true)
  const thoughtContent = useChips([], true)
  const perceptions = useChips([], true)
  const cognition = useChips([], true)
  const insightJudgment = useChips([], true)

  // risk
  const si = useChips([], false)
  const hi = useChips([], false)
  const selfHarm = useChips([], false)
  const means = useChips([], false)
  const protective = useChips([], true)

  // assessment
  const diagnoses = useChips([], true)

  // plan
  const medications = useChips([], true)
  const therapy = useChips([], true)
  const labs = useChips([], true)
  const safety = useChips([], true)
  const followUp = useChips([], false)

  const join = (s: Set<string>) => [...s].join(', ')

  const buildNote = () => {
    const lines: string[] = []

    lines.push(`PSYCHIATRIC PROGRESS NOTE`)
    lines.push(`Date: ${new Date().toLocaleDateString()}`)
    lines.push(`Visit Type: ${join(visitType.selected) || '—'}`)
    lines.push('')

    lines.push(`CHIEF COMPLAINT`)
    lines.push(join(chiefComplaint.selected) || '—')
    lines.push('')

    lines.push(`INTERVAL HISTORY`)
    lines.push(join(interval.selected) || '—')
    lines.push('')

    lines.push(`MENTAL STATUS EXAMINATION`)
    lines.push(`Appearance: ${join(appearance.selected) || '—'}`)
    lines.push(`Behavior: ${join(behavior.selected) || '—'}`)
    lines.push(`Speech: ${join(speech.selected) || '—'}`)
    lines.push(`Mood: ${join(mood.selected) || '—'}`)
    lines.push(`Affect: ${join(affect.selected) || '—'}`)
    lines.push(`Thought Process: ${join(thoughtProcess.selected) || '—'}`)
    lines.push(`Thought Content: ${join(thoughtContent.selected) || '—'}`)
    lines.push(`Perceptions: ${join(perceptions.selected) || '—'}`)
    lines.push(`Cognition: ${join(cognition.selected) || '—'}`)
    lines.push(`Insight/Judgment: ${join(insightJudgment.selected) || '—'}`)
    lines.push('')

    lines.push(`RISK ASSESSMENT`)
    lines.push(`Suicidal Ideation: ${join(si.selected) || '—'}`)
    lines.push(`Homicidal Ideation: ${join(hi.selected) || '—'}`)
    lines.push(`Self-Harm: ${join(selfHarm.selected) || '—'}`)
    lines.push(`Access to Means: ${join(means.selected) || '—'}`)
    lines.push(`Protective Factors: ${join(protective.selected) || '—'}`)
    lines.push('')

    lines.push(`ASSESSMENT / DIAGNOSES`)
    lines.push(join(diagnoses.selected) || '—')
    lines.push('')

    lines.push(`PLAN`)
    if (medications.selected.size) lines.push(`Medications: ${join(medications.selected)}`)
    if (therapy.selected.size) lines.push(`Therapy: ${join(therapy.selected)}`)
    if (labs.selected.size) lines.push(`Labs: ${join(labs.selected)}`)
    if (safety.selected.size) lines.push(`Safety: ${join(safety.selected)}`)
    lines.push(`Follow-up: ${join(followUp.selected) || '—'}`)
    lines.push('')
    lines.push(`Electronically signed — Cleo Clinical Template`)

    return lines.join('\n')
  }

  const copyNote = async () => {
    await navigator.clipboard.writeText(buildNote())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-white rounded-xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all p-4 text-sm text-slate-500 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Open Psych Note Template
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Psychiatric Appointment Note</h3>
          <p className="text-xs text-slate-400 mt-0.5">Click to select — copy when done</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyNote}
            className="text-sm bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Note'}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6 divide-y divide-slate-100">

        {/* Visit type */}
        <div className="space-y-4">
          <Section title="Visit Type">
            <ChipGroup
              options={['New Patient', 'Follow-up', 'Urgent / Crisis', 'Telehealth Follow-up']}
              selected={visitType.selected}
              onToggle={visitType.toggle}
              multi={false}
              color="slate"
            />
          </Section>

          <Section title="Chief Complaint">
            <ChipGroup
              options={[
                'Depression', 'Anxiety', 'Mood instability', 'Psychosis', 'Insomnia',
                'ADHD / attention', 'Trauma / PTSD', 'OCD', 'Panic attacks',
                'Mania / hypomania', 'Medication management', 'Behavioral concerns',
              ]}
              selected={chiefComplaint.selected}
              onToggle={chiefComplaint.toggle}
            />
          </Section>
        </div>

        {/* Interval history */}
        <div className="pt-5">
          <Section title="Interval History">
            <ChipGroup
              options={[
                'Improved since last visit', 'Stable since last visit', 'Worse since last visit',
                'Medication adherent', 'Medication non-adherent', 'Side effects reported',
                'New stressor identified', 'Sleep improved', 'Sleep worsened',
                'Appetite normal', 'Appetite decreased', 'Appetite increased',
                'Participating in therapy', 'Declined therapy',
              ]}
              selected={interval.selected}
              onToggle={interval.toggle}
            />
          </Section>
        </div>

        {/* MSE */}
        <div className="pt-5 space-y-4">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Mental Status Exam</p>

          <Section title="Appearance">
            <ChipGroup
              options={['Well-groomed', 'Casually dressed', 'Disheveled', 'Appropriate for age', 'Appears stated age', 'Appears older', 'Appears younger']}
              selected={appearance.selected}
              onToggle={appearance.toggle}
            />
          </Section>

          <Section title="Behavior">
            <ChipGroup
              options={['Cooperative', 'Pleasant', 'Guarded', 'Agitated', 'Restless', 'Psychomotor retardation', 'Good eye contact', 'Avoids eye contact']}
              selected={behavior.selected}
              onToggle={behavior.toggle}
            />
          </Section>

          <Section title="Speech">
            <ChipGroup
              options={['Normal rate & rhythm', 'Pressured', 'Slowed', 'Soft', 'Loud', 'Monotone', 'Articulate', 'Spontaneous']}
              selected={speech.selected}
              onToggle={speech.toggle}
            />
          </Section>

          <Section title="Mood (patient's words)">
            <ChipGroup
              options={['Euthymic', 'Depressed', 'Anxious', 'Irritable', 'Elevated', 'Dysphoric', 'Angry', 'Hopeless', 'Numb', 'OK']}
              selected={mood.selected}
              onToggle={mood.toggle}
              color="amber"
            />
          </Section>

          <Section title="Affect">
            <ChipGroup
              options={['Full range', 'Congruent', 'Restricted', 'Blunted', 'Flat', 'Labile', 'Expansive', 'Incongruent']}
              selected={affect.selected}
              onToggle={affect.toggle}
            />
          </Section>

          <Section title="Thought Process">
            <ChipGroup
              options={['Linear & logical', 'Goal-directed', 'Tangential', 'Circumstantial', 'Flight of ideas', 'Loose associations', 'Disorganized', 'Perseverative']}
              selected={thoughtProcess.selected}
              onToggle={thoughtProcess.toggle}
            />
          </Section>

          <Section title="Thought Content">
            <ChipGroup
              options={['No SI / HI', 'No delusions', 'No obsessions', 'Passive SI', 'Active SI no plan', 'Active SI with plan', 'Paranoid ideation', 'Grandiose delusions', 'Somatic delusions', 'Obsessive thoughts', 'Rumination']}
              selected={thoughtContent.selected}
              onToggle={thoughtContent.toggle}
              color="red"
            />
          </Section>

          <Section title="Perceptions">
            <ChipGroup
              options={['No hallucinations', 'Auditory hallucinations', 'Visual hallucinations', 'Tactile hallucinations', 'Commanding voices', 'Non-commanding voices', 'Derealization', 'Depersonalization']}
              selected={perceptions.selected}
              onToggle={perceptions.toggle}
            />
          </Section>

          <Section title="Cognition">
            <ChipGroup
              options={['Alert & oriented x4', 'Intact recent memory', 'Intact remote memory', 'Good concentration', 'Impaired concentration', 'Memory deficits noted', 'Abstract thinking intact']}
              selected={cognition.selected}
              onToggle={cognition.toggle}
            />
          </Section>

          <Section title="Insight / Judgment">
            <ChipGroup
              options={['Insight: good', 'Insight: fair', 'Insight: poor', 'Judgment: good', 'Judgment: fair', 'Judgment: poor']}
              selected={insightJudgment.selected}
              onToggle={insightJudgment.toggle}
              color="green"
            />
          </Section>
        </div>

        {/* Risk */}
        <div className="pt-5 space-y-4">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Risk Assessment</p>

          <Section title="Suicidal Ideation">
            <ChipGroup
              options={['None', 'Passive (wish to be dead)', 'Active — no plan', 'Active — with plan', 'Recent attempt']}
              selected={si.selected}
              onToggle={si.toggle}
              multi={false}
              color="red"
            />
          </Section>

          <Section title="Homicidal Ideation">
            <ChipGroup
              options={['None', 'Passive', 'Active — no plan', 'Active — with plan']}
              selected={hi.selected}
              onToggle={hi.toggle}
              multi={false}
              color="red"
            />
          </Section>

          <Section title="Self-Harm">
            <ChipGroup
              options={['None', 'History — not current', 'Current non-suicidal self-injury']}
              selected={selfHarm.selected}
              onToggle={selfHarm.toggle}
              multi={false}
              color="red"
            />
          </Section>

          <Section title="Access to Means">
            <ChipGroup
              options={['Denied', 'Firearms in home', 'Medications accessible', 'Means restriction counseled']}
              selected={means.selected}
              onToggle={means.toggle}
              color="amber"
            />
          </Section>

          <Section title="Protective Factors">
            <ChipGroup
              options={['Family support', 'Future orientation', 'Engaged in treatment', 'Religious / spiritual beliefs', 'Responsibility for children', 'Responsibility for pets', 'Reasons for living identified']}
              selected={protective.selected}
              onToggle={protective.toggle}
              color="green"
            />
          </Section>
        </div>

        {/* Assessment */}
        <div className="pt-5">
          <Section title="Assessment / Diagnoses">
            <ChipGroup
              options={[
                'MDD — moderate', 'MDD — severe', 'MDD — in remission',
                'Persistent depressive disorder', 'Bipolar I', 'Bipolar II', 'Cyclothymia',
                'GAD', 'Panic disorder', 'Social anxiety disorder', 'Specific phobia',
                'PTSD', 'Acute stress disorder', 'OCD', 'ADHD — combined', 'ADHD — inattentive',
                'Schizophrenia', 'Schizoaffective disorder', 'BPAD NOS',
                'Borderline PD', 'AUD', 'SUD — cannabis', 'SUD — stimulant', 'Insomnia disorder',
              ]}
              selected={diagnoses.selected}
              onToggle={diagnoses.toggle}
              color="slate"
            />
          </Section>
        </div>

        {/* Plan */}
        <div className="pt-5 space-y-4">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Plan</p>

          <Section title="Medications">
            <ChipGroup
              options={[
                'Continue current medications', 'Dose increase', 'Dose decrease',
                'New medication started', 'Medication discontinued', 'Taper initiated',
                'Side effect management discussed', 'Generic substitution', 'Rx sent to pharmacy',
              ]}
              selected={medications.selected}
              onToggle={medications.toggle}
            />
          </Section>

          <Section title="Therapy">
            <ChipGroup
              options={[
                'Continue individual therapy', 'Start individual therapy', 'CBT recommended',
                'DBT skills recommended', 'Trauma-focused therapy', 'Group therapy',
                'Family therapy', 'Therapy referral placed',
              ]}
              selected={therapy.selected}
              onToggle={therapy.toggle}
            />
          </Section>

          <Section title="Labs / Monitoring">
            <ChipGroup
              options={[
                'CMP ordered', 'CBC ordered', 'Lithium level', 'Valproate level',
                'TSH ordered', 'Fasting glucose / HbA1c', 'Lipid panel', 'UDS ordered',
                'Weight / BMI documented', 'BP documented',
              ]}
              selected={labs.selected}
              onToggle={labs.toggle}
              color="amber"
            />
          </Section>

          <Section title="Safety / Other">
            <ChipGroup
              options={[
                'Safety plan reviewed', 'Crisis line provided (988)', 'ER precautions given',
                'Voluntary hospitalization discussed', 'Involuntary hold considered',
                'Collateral contact obtained', 'School / work note provided',
              ]}
              selected={safety.selected}
              onToggle={safety.toggle}
              color="green"
            />
          </Section>

          <Section title="Follow-up">
            <ChipGroup
              options={['1 week', '2 weeks', '1 month', '6 weeks', '3 months', 'PRN', 'ED if worsening']}
              selected={followUp.selected}
              onToggle={followUp.toggle}
              multi={false}
            />
          </Section>
        </div>

        {/* Generated note preview */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Generated Note</p>
            <button
              onClick={copyNote}
              className="text-xs bg-slate-800 hover:bg-slate-900 text-white px-3 py-1 rounded font-medium transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 rounded-lg p-4 border border-slate-100 max-h-64 overflow-y-auto">
            {buildNote()}
          </pre>
        </div>

      </div>
    </div>
  )
}
