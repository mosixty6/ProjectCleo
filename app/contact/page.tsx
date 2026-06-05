export const metadata = {
  title: 'Contact — Nishant K. Gupta, MD',
  description:
    'Schedule a psychiatric appointment in Winter Park or Baldwin Park, Orlando. Phone only. No online forms.',
}

export default function Contact() {
  return (
    <div className="pt-20">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-6">
          Contact
        </p>
        <h1 className="text-5xl font-serif font-medium text-slate-800 leading-tight mb-6 max-w-2xl">
          To schedule, call.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          No online forms, no patient portal, no email — by design. A phone call is the right way
          to start.
        </p>
      </section>

      <div className="border-t border-stone-200" />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="mb-10">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
                Phone
              </p>
              <a
                href="tel:9296094465"
                className="font-serif text-4xl text-slate-800 hover:text-slate-600 transition-colors"
              >
                (929) 609-4465
              </a>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                If I don&apos;t answer, leave a message with your name, a brief description of
                what you&apos;re seeking, and the best number to reach you. I return calls within
                one business day.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">
                  Winter Park
                </p>
                <p className="text-sm text-slate-600">Orlando, FL — in-person available</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">
                  Baldwin Park
                </p>
                <p className="text-sm text-slate-600">Orlando, FL — in-person available</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">
                  Telehealth
                </p>
                <p className="text-sm text-slate-600">Available for Florida-licensed patients</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                What to mention when you call
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                  <span>Your name and best callback number</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                  <span>What you&apos;re seeking help with (brief — this isn&apos;t the evaluation)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                  <span>Whether you prefer in-person or telehealth</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                  <span>Your general availability for a first appointment</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-100 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                Privacy note
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This practice does not use online scheduling, intake forms, or patient portals. No
                personal health information is collected through this website. Scheduling by phone
                is intentional — not a limitation.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                Fees (for reference)
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Initial evaluation (60 min)</span>
                  <span className="font-medium text-slate-800">$400</span>
                </div>
                <div className="flex justify-between">
                  <span>Follow-up (30 min)</span>
                  <span className="font-medium text-slate-800">$200</span>
                </div>
                <p className="text-xs text-stone-400 mt-3">
                  Cash pay. Superbills available for OON reimbursement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
