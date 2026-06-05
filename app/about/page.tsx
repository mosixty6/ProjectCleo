import Link from 'next/link'

export const metadata = {
  title: 'About — Nishant K. Gupta, MD',
  description:
    'Board-certified psychiatrist in Orlando specializing in complex presentations, geriatric psychiatry, and privacy-first care.',
}

export default function About() {
  return (
    <div className="pt-20">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-6">About</p>
        <h1 className="text-5xl font-serif font-medium text-slate-800 leading-tight mb-6 max-w-2xl">
          Nishant K. Gupta, MD
        </h1>
        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          Board-certified psychiatrist. Private practice in Winter Park and Baldwin Park, Orlando.
        </p>
      </section>

      <div className="border-t border-stone-200" />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6 text-slate-600 leading-relaxed">
            <p>
              I trained in psychiatry because I was drawn to the cases that didn&apos;t resolve
              cleanly — the patient whose depression hadn&apos;t responded to three antidepressants,
              the older adult whose behavioral changes were being attributed to &ldquo;just
              aging,&rdquo; the person who had been told their anxiety was untreatable. These are
              the patients who tend to fall through the cracks of high-volume practice.
            </p>
            <p>
              My clinical focus is on complex mood and anxiety disorders, with particular attention
              to older adults. Geriatric psychiatry demands a different kind of thinking —
              polypharmacy, medical comorbidity, cognitive overlay, caregiver dynamics. I find that
              work genuinely interesting, and it&apos;s where I can be most useful.
            </p>
            <p>
              I practice privately and independently. That means longer appointments, a thorough
              history before any conclusions, and the ability to revisit a diagnosis when the
              evidence calls for it. It also means your records stay with me — not in a shared
              hospital system, not accessible to an insurance reviewer, not attached to your name
              in a database you didn&apos;t choose.
            </p>
            <p>
              If you are a professional, executive, or anyone for whom privacy in psychiatric care
              is not a preference but a necessity, this practice was built with that in mind.
            </p>

            {/* Credentials placeholder */}
            <div className="mt-8 pt-8 border-t border-stone-200">
              <h2 className="font-serif text-2xl text-slate-800 mb-4">Training &amp; Credentials</h2>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>MD — SUNY Downstate Medical Center</li>
                <li>Psychiatry Residency — Harvard Medical School / Brigham and Women&apos;s Hospital</li>
                <li>Board Certified, American Board of Psychiatry and Neurology</li>
                <li>Licensed in Florida</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                In Practice
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Complex mood disorders</li>
                <li>Geriatric psychiatry</li>
                <li>Treatment-resistant depression</li>
                <li>Dementia behavioral symptoms</li>
                <li>Anxiety disorders</li>
                <li>Diagnostic clarification</li>
              </ul>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                Practice Philosophy
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Cash pay only</li>
                <li>No insurance panels</li>
                <li>No shared EHR</li>
                <li>Superbills available</li>
                <li>Phone scheduling only</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="tel:9296094465"
            className="inline-flex items-center justify-center bg-slate-800 text-stone-50 px-7 py-3.5 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Call to Schedule — (929) 609-4465
          </a>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center border border-stone-300 text-slate-700 px-7 py-3.5 rounded text-sm font-medium hover:border-stone-400 transition-colors"
          >
            Common Questions
          </Link>
        </div>
      </section>
    </div>
  )
}
