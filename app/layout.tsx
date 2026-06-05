import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Nishant K. Gupta, MD — Psychiatry | Orlando, FL',
  description:
    'Private psychiatric practice in Winter Park and Baldwin Park, Orlando. Specializing in complex presentations, geriatric psychiatry, mood disorders, anxiety, and dementia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-stone-50 text-slate-800 font-sans antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-lg font-medium text-slate-800 tracking-wide hover:text-slate-600 transition-colors"
            >
              Nishant K. Gupta, MD
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/services" className="hover:text-slate-900 transition-colors">
                Services
              </Link>
              <Link href="/faq" className="hover:text-slate-900 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">
                Contact
              </Link>
              <a
                href="tel:9296094465"
                className="bg-slate-800 text-stone-50 px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors"
              >
                (929) 609-4465
              </a>
            </div>
            <a href="tel:9296094465" className="md:hidden text-sm font-medium text-slate-800">
              (929) 609-4465
            </a>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-slate-800 text-stone-300 py-14 mt-24">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
            <div>
              <p className="font-serif text-stone-100 text-xl mb-1">Nishant K. Gupta, MD</p>
              <p className="text-sm text-stone-400">Private Psychiatric Practice</p>
              <p className="text-sm text-stone-400 mt-1">
                Winter Park &amp; Baldwin Park — Orlando, FL
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-200 mb-2">To Schedule</p>
              <a
                href="tel:9296094465"
                className="text-stone-100 hover:text-white transition-colors text-sm"
              >
                (929) 609-4465
              </a>
              <p className="text-xs text-stone-500 mt-3">Cash pay only. Superbills available.</p>
              <p className="text-xs text-stone-500">No online scheduling. No data collection.</p>
            </div>
            <div className="text-xs text-stone-500">
              <p>© {new Date().getFullYear()} Nishant K. Gupta, MD</p>
              <p className="mt-1">This site does not collect personal information.</p>
              <p className="mt-1">
                Winter Park, FL &nbsp;|&nbsp; Baldwin Park, FL &nbsp;|&nbsp; Telehealth, FL
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
