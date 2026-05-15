export const metadata = {
  title: 'Technical Details | AlignAIR Docs',
  description: 'In-depth technical documentation of the AlignAIR model and algorithms.'
}

import Link from 'next/link'

const sections = [
  {
    number: '01',
    category: 'architecture',
    title: 'Model architecture',
    body: "Learn how AlignAIR's residual convolutional backbone processes and segments sequences.",
    href: '/docs/technical/architecture',
  },
  {
    number: '02',
    category: 'thresholding',
    title: 'Thresholding logic',
    body: 'How AlignAIR selects V, D, and J alleles from likelihood vectors using dynamic thresholds and caps.',
    href: '/docs/technical/thresholding',
  },
  {
    number: '03',
    category: 'mutations',
    title: 'Mutation models',
    body: 'Simulation models used to train AlignAIR on realistic SHM patterns, including S5F.',
    href: '/docs/technical/mutations',
  },
];

export default function TechnicalDocsPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // technical
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Technical Overview
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Architectural and algorithmic foundation of AlignAIR. Intended for users who want to understand the
            segmentation model, likelihood thresholding mechanism, and mutation simulation framework.
          </p>
        </div>

        {/* Section grid */}
        <div className="py-12">
          <div className="grid sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group block bg-white dark:bg-black p-6 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
              >
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                  {s.number} / {s.category}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {s.body}
                </p>
                <div className="inline-flex items-center text-sm text-purple-700 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                  Open
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
