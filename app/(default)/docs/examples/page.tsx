export const metadata = {
  title: 'Examples Gallery | AlignAIR Docs',
  description: 'Interactive examples and use cases for AlignAIR sequence analysis.',
}

import Link from 'next/link'

export default function ExamplesPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Examples Gallery
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Explore real-world examples of AlignAIR in action. See input sequences, commands, and expected outputs for different use cases.
            </p>
          </div>
        </div>

        {/* Example Categories */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Example Categories</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Basic Analysis */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Basic Analysis</h3>
                  <p className="text-sm text-gray-400">Single sequence processing</p>
                </div>
              </div>
            </div>

            {/* Batch Processing */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Batch Processing</h3>
                  <p className="text-sm text-gray-400">Large dataset analysis</p>
                </div>
              </div>
            </div>

            {/* Custom Parameters */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Custom Parameters</h3>
                  <p className="text-sm text-gray-400">Optimized configurations</p>
                </div>
              </div>
            </div>

            {/* Advanced Use Cases */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Advanced</h3>
                  <p className="text-sm text-gray-400">Complex workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example 1: Basic Heavy Chain Analysis */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-2xl p-8 border border-blue-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="h2 mb-0 text-white">Example 1: Basic Heavy Chain Analysis</h2>
                <p className="text-blue-200 mt-2">Single sequence V(D)J assignment with default parameters</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Input */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📥 Input</h3>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Input File (sequences.csv):</div>
                    <div className="bg-black rounded-lg p-3 border border-gray-600">
                      <pre className="text-green-400 font-mono text-xs overflow-x-auto">
sequence_id,sequence
seq_001,CAGGTGCAGCTGGTGGAGTCTGGGGGAGGCTTGGTAAAGCCT...
seq_002,GAGGTGCAGCTGGTGGAGTCTGGGGGAGGCTTGGTAAAGCCT...
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Command:</div>
                    <div className="bg-black rounded-lg p-3 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-xs overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \
  --chain-type=heavy \
  --sequences=/data/input/sequences.csv \
  --save-path=/data/output/results
                      </pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📤 Expected Output</h3>

                <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Output File (results.csv):</div>
                  <div className="bg-black rounded-lg p-3 border border-gray-600">
                    <pre className="text-green-400 font-mono text-xs overflow-x-auto">
sequence_id,v_call,d_call,j_call,productive
seq_001,IGHV1-2*01,IGHD3-3*01,IGHJ4*01,True
seq_002,IGHV1-3*01,IGHD2-2*01,IGHJ6*01,True
                    </pre>
                  </div>
                </div>

                <div className="mt-4 bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-blue-300 font-medium mb-1">Processing Details</div>
                      <div className="text-blue-200 text-sm">
                        • 2 sequences processed<br/>
                        • Default thresholds used (V:0.75, D:0.3, J:0.8)<br/>
                        • Both sequences are productive
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example 2: Light Chain with Custom Thresholds */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-8 border border-green-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="h2 mb-0 text-white">Example 2: Light Chain with Custom Thresholds</h2>
                <p className="text-green-200 mt-2">High-stringency analysis for clean data</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Input */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📥 Setup</h3>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Use Case:</div>
                    <div className="text-green-200 text-sm">
                      High-quality light chain sequences from flow-sorted B cells. Using stricter thresholds for precise allele calling.
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Command:</div>
                    <div className="bg-black rounded-lg p-3 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-xs overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \
  --chain-type=light \
  --sequences=/data/input/light_chains.csv \
  --save-path=/data/output/light_results \
  --v-allele-threshold=0.9 \
  --j-allele-threshold=0.85 \
  --airr-format
                      </pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📊 Results Analysis</h3>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Threshold Impact:</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">V calls with default (0.75):</span>
                        <span className="text-yellow-400">1,850 calls</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">V calls with strict (0.9):</span>
                        <span className="text-green-400">1,650 calls</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Higher confidence, fewer ambiguous calls
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Output Format:</div>
                    <div className="text-green-200 text-sm">
                      Full AIRR Schema with standardized column names for downstream analysis pipelines.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3: Large Dataset Processing */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 border border-purple-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="h2 mb-0 text-white">Example 3: Large Dataset Processing</h2>
                <p className="text-purple-200 mt-2">Optimized parameters for 100K+ sequences</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Performance Optimization */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">⚡ Performance Setup</h3>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Optimized Command:</div>
                    <div className="bg-black rounded-lg p-3 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-xs overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \
  --chain-type=heavy \
  --sequences=/data/input/large_dataset.csv \
  --save-path=/data/output/batch_results \
  --batch-size=4096 \
  --fix-orientation
                      </pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-3">Performance Tips:</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Increased batch size to 4096</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Enabled orientation fixing</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">GPU memory: 16GB+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benchmark Results */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📈 Benchmark Results</h3>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-3">Processing Times:</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">100K sequences</span>
                          <span className="text-purple-400">45 minutes</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">500K sequences</span>
                          <span className="text-purple-400">3.5 hours</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Resource Usage:</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-purple-400 font-bold text-lg">12GB</div>
                        <div className="text-gray-300">GPU Memory</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold text-lg">95%</div>
                        <div className="text-gray-300">GPU Utilization</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Templates */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">🚀 Quick Start Templates</h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Template 1 */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Standard Heavy Chain</h3>
              </div>

              <div className="bg-black rounded-lg p-4 border border-gray-700 relative group">
                <pre className="text-green-400 font-mono text-xs overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \
  --chain-type=heavy \
  --sequences=/data/input/sequences.csv \
  --save-path=/data/output
                </pre>
                <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-teal-600 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">High-Quality Light Chain</h3>
              </div>

              <div className="bg-black rounded-lg p-4 border border-gray-700 relative group">
                <pre className="text-green-400 font-mono text-xs overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \
  --chain-type=light \
  --sequences=/data/input/light_chains.csv \
  --save-path=/data/output \
  --v-allele-threshold=0.85 \
  --j-allele-threshold=0.9 \
  --airr-format
                </pre>
                <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="h2 mb-6 text-white">Ready to Try These Examples?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Use these examples as starting points for your own AlignAIR analyses. Modify parameters based on your specific data and requirements.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/docs/installation" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
              <Link href="/docs/usage" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Parameter Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}