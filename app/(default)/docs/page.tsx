export const metadata = {
  title: 'AlignAIR Docs',
  description: 'AlignAIR Documentation Hub',
}

import Link from 'next/link'

export default function DocsPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">AlignAIR Documentation</h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              Find everything you need to install, use, and understand AlignAIR. Start by selecting a section below.
            </p>
          </div>
        </div>

        {/* Docs section previews */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 py-12 md:py-20 border-t border-gray-800">

            {/* Card: Installation */}
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col hover:bg-gray-800 transition">
              <h3 className="h3 mb-3 text-white">Installation</h3>
              <p className="text-gray-400 mb-6">
                Learn how to install AlignAIR using Docker or build from source manually.
              </p>
              <Link href="/docs/installation" className="text-purple-400 hover:underline text-sm font-medium">
                Go to Installation →
              </Link>
            </div>

            {/* Card: Usage */}
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col hover:bg-gray-800 transition">
              <h3 className="h3 mb-3 text-white">Usage</h3>
              <p className="text-gray-400 mb-6">
                How to run AlignAIR inside Docker, configure parameters, and optimize performance.
              </p>
              <Link href="/docs/usage" className="text-purple-400 hover:underline text-sm font-medium">
                Go to Usage →
              </Link>
            </div>

            {/*/!* Card: Examples *!/*/}
            {/*<div className="bg-gray-900 rounded-lg p-6 flex flex-col hover:bg-gray-800 transition">*/}
            {/*  <h3 className="h3 mb-3 text-white">Examples</h3>*/}
            {/*  <p className="text-gray-400 mb-6">*/}
            {/*    See real-world examples of using AlignAIR to align IGH/IGL sequences efficiently.*/}
            {/*  </p>*/}
            {/*  <Link href="/docs/examples" className="text-purple-400 hover:underline text-sm font-medium">*/}
            {/*    Go to Examples →*/}
            {/*  </Link>*/}
            {/*</div>*/}

            {/*/!* Card: Advanced Topics *!/*/}
            {/*<div className="bg-gray-900 rounded-lg p-6 flex flex-col hover:bg-gray-800 transition">*/}
            {/*  <h3 className="h3 mb-3 text-white">Advanced Topics</h3>*/}
            {/*  <p className="text-gray-400 mb-6">*/}
            {/*    Learn about fine-tuning models, custom pipelines, and troubleshooting tips.*/}
            {/*  </p>*/}
            {/*  <Link href="/docs/advanced" className="text-purple-400 hover:underline text-sm font-medium">*/}
            {/*    Go to Advanced Topics →*/}
            {/*  </Link>*/}
            {/*</div>*/}

            {/* Card: Technical Details */}
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col hover:bg-gray-800 transition">
              <h3 className="h3 mb-3 text-white">Technical Details</h3>
              <p className="text-gray-400 mb-6">
                Dive into the algorithms, deep learning architecture, training pipeline, and theoretical insights behind AlignAIR.
              </p>
              <Link href="/docs/technical" className="text-purple-400 hover:underline text-sm font-medium">
                Go to Technical Details →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
