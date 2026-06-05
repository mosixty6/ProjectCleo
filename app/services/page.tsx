import Link from 'next/link'

export const metadata = {
  title: 'Services & Fees — Nishant K. Gupta, MD',
  description:
    'Psychiatric services in Orlando: intake evaluations, medication management, and telehealth. Cash pay, superbills available.',
}

export default function Services() {
  return (
    <div className="pt-20">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-6">
          Services
        </p>
        <h1 className="text-5xl font-serif font-medium text-slate-800 leading-tight mb-6 max-w-2xl">
          What to expect
        </h1>
        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          Private psychiatric care in Winter Park and Baldwin Park. In-person and telehealth
          available. Cash pay, superbills provided.
        </p>
      </section>

      <div className="border-t border-stone-200" />

      {/* Visit types + fees */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-medium text-slate-800 mb-10">Fees</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
              Initial Evaluation
            </p>
            <p className="font-serif text-4xl text-slate-800 mb-2">$400</p>
            <p className="text-sm text-stone-500 mb-6">60 minutes</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              A thorough psychiatric history — chief complaint, present illness, past psychiatric
              and medical history, family history, social context, and medications. The goal is a
              complete picture before any conclusions, not a diagnosis in the first 20 minutes.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
              Follow-Up Visit
            </p>
            <p className="font-serif text-4xl text-slate-800 mb-2">$200</p>
            <p className="text-sm text-stone-500 mb-6">30 minutes</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interval follow-up for medication management, symptom review, and any adjustments.
              Frequency is determined by clinical need — not by insurance requirements or
              administrative defaults.
            </p>
          </div>
        </div>
        <div className="bg-stone-100 rounded-lg p-6 text-sm text-slate-600 leading-relaxed max-w-2xl">
          <p className="font-medium text-slate-700 mb-2">Insurance &amp; Superbills</p>
          <p>
            This practice does not accept insurance. Payment is due at time of service. A superbill
            — an itemized receipt with diagnostic and procedure codes — is provided upon request so
            you can submit for out-of-network reimbursement directly with your insurer. Many PPO
            plans reimburse a portion of out-of-network psychiatric care; check your benefits
            before your first appointment.
          </p>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Conditions */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-medium text-slate-800 mb-10">
          Conditions treated
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: 'Major Depressive Disorder',
              detail: [
                'Treatment-resistant and recurrent depression',
                'Late-life and geriatric depression',
                'Depression complicating medical illness',
                'Medication optimization and augmentation',
              ],
            },
            {
              name: 'Bipolar Disorder',
              detail: [
                'Bipolar I and II, diagnostic clarification',
                'Complex mood histories with multiple prior diagnoses',
                'Long-term mood stabilization',
                'Medication management in older adults',
              ],
            },
            {
              name: 'Anxiety Disorders',
              detail: [
                'Generalized anxiety disorder',
                'Panic disorder',
                'Anxiety secondary to medical conditions',
                'Anxiety in the context of cognitive decline',
              ],
            },
            {
              name: 'Dementia & Cognitive Disorders',
              detail: [
                'Behavioral and psychiatric symptoms of dementia',
                'Early cognitive decline evaluation',
                'Caregiver consultation and guidance',
                'Differential diagnosis of cognitive change',
              ],
            },
          ].map((c) => (
            <div key={c.name} className="bg-white border border-stone-200 rounded-lg p-6">
              <h3 className="font-serif text-xl text-slate-800 mb-4">{c.name}</h3>
              <ul className="space-y-2">
                {c.detail.map((d) => (
                  <li key={d} className="text-sm text-slate-500 flex gap-2">
                    <span className="text-stone-300 mt-0.5">—</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Locations */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-medium text-slate-800 mb-10">
          Locations &amp; Telehealth
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
              Winter Park
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              In-person appointments available in Winter Park, FL.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
              Baldwin Park
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              In-person appointments available in Baldwin Park, FL.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
              Telehealth
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Video visits available for all Florida-licensed patients. Same clinical standard as
              in-person.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">Schedule an evaluation</h2>
          <p className="text-stone-300 mb-8 max-w-sm mx-auto text-sm">
            Call to schedule. New patient availability is limited.
          </p>
          <a
            href="tel:9296094465"
            className="inline-flex items-center justify-center bg-stone-50 text-slate-800 px-8 py-4 rounded text-sm font-medium hover:bg-stone-200 transition-colors"
          >
            (929) 609-4465
          </a>
        </div>
      </section>
    </div>
  )
}
