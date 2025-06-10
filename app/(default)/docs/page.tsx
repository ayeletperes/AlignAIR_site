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
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" data-aos="fade-up">
              AlignAIR Documentation
            </h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              Find everything you need to install, use, and understand AlignAIR. Start by selecting a section below.
            </p>
          </div>
        </div>

        {/* Quick Start Banner */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-2xl p-8 border border-green-700">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">🚀 New to AlignAIR?</h2>
                <p className="text-green-200 mb-6">
                  Get up and running in under 10 minutes with our quick start guide. No complex setup required!
                </p>
                <div className="flex space-x-4">
                  <Link href="/docs/installation" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Quick Install
                  </Link>
                  <Link href="/docs/examples" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    View Examples
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Quick Command:</div>
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
docker pull thomask90/alignair:latest
docker run -it --rm \\
  -v ~/data:/data \\
  thomask90/alignair:latest
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main documentation sections - Updated with consistent heights */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 py-12 md:py-20 border-t border-gray-800">

            {/* Card: Installation */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Installation</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Step-by-step guide to install AlignAIR using Docker or build from source manually. Includes system requirements and troubleshooting.
                  </p>
                  <Link href="/docs/installation" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Get Started
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: Usage */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Usage Guide</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Learn how to run AlignAIR with different parameters, configure thresholds, and optimize performance for your datasets.
                  </p>
                  <Link href="/docs/usage" className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Learn Usage
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: Examples */}
            <div className="group">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-yellow-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Examples</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Real-world examples with sample data, commands, and expected outputs. From basic analysis to advanced workflows.
                  </p>
                  <Link href="/docs/examples" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    View Examples
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: Technical Details */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Technical Details</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Deep dive into the algorithms, neural network architecture, training pipeline, and theoretical insights behind AlignAIR.
                  </p>
                  <Link href="/docs/technical" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Explore Technical
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: FAQ & Help */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">FAQ & Help</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Common questions, troubleshooting guides, and community support. Get quick answers to installation, usage, and technical questions.
                  </p>
                  <Link href="/docs/faq" className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Get Help
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: Terms & License */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-500 to-slate-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Terms & License</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Legal information, licensing terms, data privacy policies, and usage rights for AlignAIR and documentation.
                  </p>
                  <Link href="/docs/terms" className="text-gray-400 hover:text-gray-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    View Legal Info
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: API Reference */}
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">API Reference</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Complete parameter reference, input/output formats, and integration guides for programmatic usage and workflows.
                  </p>
                  <Link href="/docs/api" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    API Docs
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Sections */}
        <div className="mb-20">
          <h2 className="h2 text-center mb-12 text-white">🔥 Popular Sections</h2>

          <div className="grid md:grid-cols-3 gap-6">

            <Link href="/docs/installation" className="group bg-gray-900 hover:bg-gray-800 rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Docker Quick Start</h3>
              </div>
              <p className="text-gray-400 text-base group-hover:text-gray-300 leading-relaxed">
                Get AlignAIR running in minutes with our Docker installation guide.
              </p>
            </Link>

            <Link href="/docs/usage" className="group bg-gray-900 hover:bg-gray-800 rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Parameter Guide</h3>
              </div>
              <p className="text-gray-400 text-base group-hover:text-gray-300 leading-relaxed">
                Learn how to configure thresholds and optimize for your data.
              </p>
            </Link>

            <Link href="/docs/technical/architecture" className="group bg-gray-900 hover:bg-gray-800 rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Model Architecture</h3>
              </div>
              <p className="text-gray-400 text-base group-hover:text-gray-300 leading-relaxed">
                Understand the neural network design and training process.
              </p>
            </Link>
          </div>
        </div>

        {/* Community & Support */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-10 border border-gray-700">
            <div className="text-center">
              <h2 className="h2 mb-6 text-white">💬 Community & Support</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the AlignAIR community, get help, and contribute to the project.
              </p>
              <div className="flex justify-center space-x-6">
                <a href="https://github.com/MuteJester/AlignAIR" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://github.com/MuteJester/AlignAIR/discussions" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Discussions
                </a>
                <a href="https://github.com/MuteJester/AlignAIR/issues" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Report Issue
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="text-center mb-16">
          <div className="bg-blue-900/30 rounded-2xl p-10 border border-blue-700">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">📝 Documentation Updates</h2>
            <p className="text-blue-200 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              We're constantly improving our documentation. New interactive guides, examples, and troubleshooting content added regularly.
            </p>
            <div className="flex justify-center">
              <Link href="/docs/changelog" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center text-lg">
                View Recent Changes
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}