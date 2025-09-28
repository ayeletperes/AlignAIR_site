export const metadata = {
  title: 'AlignAIR Tools',
  description: 'Tools and utilities for AlignAIR',
}

import Link from 'next/link'

export default function ToolsPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" data-aos="fade-up">
              AlignAIR Tools
            </h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              Powerful utilities and tools to enhance your immunogenetics research workflow.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 py-12 md:py-20 border-t border-gray-800">

            {/* Allele Query Tool */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Allele Query</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Search and explore allele information across different naming conventions. Find alleles by IUIS, IG label, ASC, or sequence.
                  </p>
                  <Link href="/tools/allele-query" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Query Alleles
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Coming Soon Tools */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-0.5 rounded-2xl transition-all duration-300">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col opacity-60">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Sequence Validator</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Validate and analyze immunoglobulin sequences for common issues and quality metrics.
                  </p>
                  <div className="text-gray-500 text-sm font-medium flex items-center">
                    Coming Soon
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-0.5 rounded-2xl transition-all duration-300">
                <div className="bg-gray-900 rounded-2xl p-6 h-80 flex flex-col opacity-60">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-600 rounded-xl mr-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="h3 mb-0 text-white">Repertoire Analyzer</h3>
                  </div>
                  <p className="text-gray-400 mb-6 flex-1">
                    Analyze and visualize immunoglobulin repertoire data with advanced statistical tools.
                  </p>
                  <div className="text-gray-500 text-sm font-medium flex items-center">
                    Coming Soon
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
  }
} 