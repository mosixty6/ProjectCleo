import Link from 'next/link'

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-6">
            Private Practice — Orlando, FL
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-slate-800 leading-tight mb-6">
            Psychiatry for cases that require more.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
            Complex presentations, geriatric care, and difficult diagnostic questions — handled
            thoughtfully, with full attention to your privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:9296094465"
              className="inline-flex items-center justify-center bg-slate-800 text-stone-50 px-7 py-3.5 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Call to Schedule — (929) 609-4465
            </a>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center border border-stone-300 text-slate-700 px-7 py-3.5 rounded text-sm font-medium hover:border-stone-400 hover:text-slate-800 transition-colors"
            >
              Common Questions
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* About teaser */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="text-3xl font-serif font-medium text-slate-800 mb-5">
              A different kind of practice.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Most psychiatric practices are built for volume. Fifteen-minute appointments, rushed
              histories, diagnoses that get assigned in the first session. That model works for
              straightforward cases. It fails the rest.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This practice is built for the rest — patients with years of diagnoses that don&apos;t
              quite fit, medication trials that haven&apos;t worked, and presentations that require
              a longer look. Older adults navigating the intersection of medical illness, cognitive
              change, and psychiatric symptoms.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Cash pay, no insurance panels, no electronic health record shared across systems.
              Your care stays between us.
            </p>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900 transition-colors"
            >
              More about my approach →
            </Link>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
                Locations
              </p>
              <p className="font-serif text-xl text-slate-800 mb-1">
                Winter Park &amp; Baldwin Park
              </p>
              <p className="text-sm text-slate-500">Orlando, Florida</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
                Telehealth
              </p>
              <p className="font-serif text-xl text-slate-800 mb-1">Available statewide</p>
              <p className="text-sm text-slate-500">Florida-licensed patients</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
                Scheduling
              </p>
              <p className="font-serif text-xl text-slate-800 mb-1">By phone only</p>
              <p className="text-sm text-slate-500">No online forms. No data collected.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Conditions */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-4">
          Areas of Focus
        </p>
        <h2 className="text-3xl font-serif font-medium text-slate-800 mb-12">
          Conditions I treat
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: 'Major Depression',
              detail:
                'Treatment-resistant presentations, late-life depression, and cases complicated by medical illness.',
            },
            {
              name: 'Bipolar Disorder',
              detail:
                'Complex mood histories, diagnostic clarification, and long-term medication management.',
            },
            {
              name: 'Anxiety Disorders',
              detail:
                'Generalized anxiety, panic, and anxiety secondary to medical or cognitive conditions.',
            },
            {
              name: 'Dementia & Memory',
              detail:
                'Behavioral symptoms of dementia, caregiver guidance, and early cognitive decline evaluation.',
            },
          ].map((c) => (
            <div key={c.name} className="bg-white border border-stone-200 rounded-lg p-6">
              <h3 className="font-serif text-xl text-slate-800 mb-3">{c.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/services"
            className="text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900 transition-colors"
          >
            View services and fees →
          </Link>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Privacy */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-4">
            Privacy
          </p>
          <h2 className="text-3xl font-serif font-medium text-slate-800 mb-5">
            Your records stay private.
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This practice does not participate in insurance networks and does not use a shared
            electronic health record. Scheduling is by phone — no intake forms, no patient portals,
            no third-party data processors.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            For patients who are professionals, executives, or anyone with reason to keep their
            psychiatric care off the record, this matters. Superbills are available for those who
            choose to seek out-of-network reimbursement from their own insurer.
          </p>
          <Link
            href="/faq"
            className="text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900 transition-colors"
          >
            Read the FAQ →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Ready to schedule?
          </h2>
          <p className="text-stone-300 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Call during business hours. If I don&apos;t answer, leave a message and I&apos;ll
            return your call within one business day.
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
