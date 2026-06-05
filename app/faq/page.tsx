import Link from 'next/link'

export const metadata = {
  title: 'FAQ — Nishant K. Gupta, MD',
  description:
    'Answers to common questions about scheduling, fees, insurance, telehealth, privacy, and what to expect.',
}

const faqs = [
  {
    section: 'Scheduling',
    items: [
      {
        q: 'How do I schedule an appointment?',
        a: 'By phone only. Call (929) 609-4465 during business hours. If I don\'t answer, leave a message with your name, a brief description of what you\'re seeking, and the best number to reach you. I return calls within one business day. There is no online scheduling, no patient portal, and no intake forms — by design.',
      },
      {
        q: 'Are you accepting new patients?',
        a: 'Availability is limited. Call to inquire about current openings. I do not maintain a waiting list.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Please give at least 48 hours notice if you need to cancel or reschedule. Late cancellations and no-shows are charged the full session fee.',
      },
    ],
  },
  {
    section: 'Fees & Insurance',
    items: [
      {
        q: 'Do you accept insurance?',
        a: 'No. This is a cash-pay practice. I do not participate in any insurance networks, including Medicare and Medicaid. Payment is due at the time of service.',
      },
      {
        q: 'What do you charge?',
        a: 'Initial evaluation (60 minutes): $400. Follow-up visit (30 minutes): $200. Payment is accepted by check, cash, or credit card.',
      },
      {
        q: 'What is a superbill, and can I get one?',
        a: 'A superbill is an itemized receipt that includes your diagnosis, the procedure performed, and the relevant billing codes. You can submit it to your insurance company to request out-of-network reimbursement. I provide superbills on request. Many PPO plans cover a portion of out-of-network psychiatric care — check your benefits before your first appointment. I cannot guarantee reimbursement and do not communicate directly with insurers on your behalf.',
      },
      {
        q: 'Why cash pay? Isn\'t that a barrier?',
        a: 'It is, for some patients — and I don\'t minimize that. For others, the privacy and clinical independence that come with cash pay are worth the cost. Insurance participation requires using a shared EHR, filing claims that create a permanent record, and accepting oversight of clinical decisions. This practice is built for patients who want something different.',
      },
    ],
  },
  {
    section: 'Telehealth',
    items: [
      {
        q: 'Do you offer telehealth?',
        a: 'Yes. Video visits are available for all patients licensed in Florida. The clinical standard is the same as in-person. For geriatric patients or those with significant medical complexity, in-person is often preferable for the initial evaluation — we can discuss what makes sense for your situation.',
      },
      {
        q: 'What platform do you use for telehealth?',
        a: 'I use a HIPAA-compliant video platform. Details are provided when you schedule.',
      },
    ],
  },
  {
    section: 'Privacy',
    items: [
      {
        q: 'How is my privacy protected?',
        a: 'This practice does not use a shared or hospital-affiliated electronic health record. Your records are maintained privately and are not accessible to insurance companies, hospital systems, or other providers unless you provide explicit written authorization. Scheduling is by phone only — no online forms, no patient portal, no third-party data processors.',
      },
      {
        q: 'Will my employer, insurer, or anyone else be able to see that I\'ve been seen here?',
        a: 'If you pay cash and do not submit a superbill, there is no insurance claim and no record in any insurance database. Your employer has no access to your medical records. The only way your records leave this practice is with your written authorization, or as required by law (imminent safety concerns, subpoena, mandatory reporting).',
      },
      {
        q: 'Do you do FMLA paperwork or disability evaluations?',
        a: 'I can complete FMLA paperwork and certain disability-related documentation for established patients. There is an administrative fee for these services. I do not perform forensic evaluations for legal proceedings.',
      },
    ],
  },
  {
    section: 'Clinical',
    items: [
      {
        q: 'What conditions do you treat?',
        a: 'Major depressive disorder, bipolar disorder, anxiety disorders, and dementia-related psychiatric symptoms. I focus on complex presentations — patients with long histories, multiple prior treatments, or diagnoses that don\'t fully account for their symptoms. I do not treat schizophrenia, active substance use disorders, eating disorders, or childhood/adolescent psychiatric conditions.',
      },
      {
        q: 'Do you do therapy, or only medication management?',
        a: 'Primarily medication management and psychiatric evaluation. Appointments include supportive discussion, but I do not provide formal psychotherapy. I can refer to therapists who work well with the patient populations I see.',
      },
      {
        q: 'Do you prescribe controlled substances?',
        a: 'Yes, when clinically indicated. Stimulants for ADHD and benzodiazepines for anxiety or situational use may be prescribed as part of a comprehensive treatment plan. I do not prescribe controlled substances at the initial visit or without a thorough evaluation.',
      },
      {
        q: 'I\'ve seen multiple psychiatrists and nothing has worked. Is this the right practice?',
        a: 'Possibly. Treatment-resistant presentations, diagnostic uncertainty, and histories of partial or failed responses are exactly what I spend most of my time on. The first step is an honest evaluation — which sometimes confirms a previous diagnosis and sometimes doesn\'t.',
      },
    ],
  },
]

export default function FAQ() {
  return (
    <div className="pt-20">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-6">FAQ</p>
        <h1 className="text-5xl font-serif font-medium text-slate-800 leading-tight mb-6 max-w-2xl">
          Common questions
        </h1>
        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          Answers to what most people want to know before calling.
        </p>
      </section>

      <div className="border-t border-stone-200" />

      <section className="max-w-3xl mx-auto px-6 py-16">
        {faqs.map((section, si) => (
          <div key={section.section} className={si > 0 ? 'mt-14' : ''}>
            <h2 className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-8">
              {section.section}
            </h2>
            <div className="space-y-8">
              {section.items.map((item) => (
                <div key={item.q} className="border-b border-stone-200 pb-8">
                  <h3 className="font-serif text-xl text-slate-800 mb-3">{item.q}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">Still have questions?</h2>
          <p className="text-stone-300 mb-8 max-w-sm mx-auto text-sm">
            Call and I or my office will answer directly.
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
