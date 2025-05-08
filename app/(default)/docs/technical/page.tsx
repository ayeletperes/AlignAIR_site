export const metadata = {
  title: 'Technical Details | AlignAIR Docs',
  description: 'In-depth technical documentation of the AlignAIR model and algorithms.'
}

import Link from 'next/link'

export default function TechnicalDocsPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4">Technical Overview</h1>
            <p className="text-xl text-gray-400 mb-8">
              This section presents the architectural and algorithmic foundation of AlignAIR. It is intended for users
              who are interested in understanding the inner workings of the pipeline including its segmentation model,
              likelihood thresholding mechanism, and mutation simulation framework.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20 border-t border-gray-800 grid gap-8 md:grid-cols-2">

            <div>
              <h2 className="h3 mb-2">🧠 Model Architecture</h2>
              <p className="text-gray-400 mb-4">
                Learn how AlignAIR's residual convolutional backbone processes and segments sequences.
              </p>
              <Link className="text-purple-500 hover:underline" href="/docs/technical/architecture">Explore Architecture →</Link>
            </div>

            <div>
              <h2 className="h3 mb-2">🎚️ Thresholding Logic</h2>
              <p className="text-gray-400 mb-4">
                Understand how AlignAIR selects V, D, and J alleles from likelihood vectors using dynamic thresholds and caps.
              </p>
              <Link className="text-purple-500 hover:underline" href="/docs/technical/thresholding">Explore Thresholding →</Link>
            </div>

            <div>
              <h2 className="h3 mb-2">🧬 Mutation Models</h2>
              <p className="text-gray-400 mb-4">
                Explore the simulation models used to train AlignAIR on realistic SHM patterns, including S5F.
              </p>
              <Link className="text-purple-500 hover:underline" href="/docs/technical/mutations">Explore Mutation Models →</Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
