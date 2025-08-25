export const metadata = {
  title: 'FAQ & Troubleshooting | AlignAIR Docs',
  description: 'Frequently asked questions and troubleshooting guide for AlignAIR.',
}

export default function FAQPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FAQ & Troubleshooting
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Find quick answers to common questions and solutions to potential issues you might encounter while using AlignAIR.
            </p>
          </div>
        </div>

        {/* Quick Problem Solver */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-2xl p-8 border border-red-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-red-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">🚨 Common Issues & Quick Fixes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Docker Issues */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-bold text-white">Docker Won't Start</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-300 font-medium text-sm mb-1">Error: Cannot connect to Docker daemon</div>
                    <div className="text-gray-300 text-sm">
                      <strong>Solution:</strong> Start Docker Desktop or run <code className="bg-black text-green-400 px-1 rounded">sudo systemctl start docker</code>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-300 font-medium text-sm mb-1">Error: Permission denied</div>
                    <div className="text-gray-300 text-sm">
                      <strong>Solution:</strong> Add user to docker group: <code className="bg-black text-green-400 px-1 rounded">sudo usermod -aG docker $USER</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Issues */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <h3 className="text-xl font-bold text-white">Out of Memory</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-yellow-300 font-medium text-sm mb-1">CUDA out of memory error</div>
                    <div className="text-gray-300 text-sm">
                      <strong>Solution:</strong> Reduce batch size: <code className="bg-black text-green-400 px-1 rounded">--batch-size=512</code>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-yellow-300 font-medium text-sm mb-1">System memory exhausted</div>
                    <div className="text-gray-300 text-sm">
                      <strong>Solution:</strong> Process smaller datasets or increase swap space
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            {/* Installation */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Installation</h3>
                  <p className="text-sm text-gray-400">Setup, Docker, and environment issues</p>
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Usage</h3>
                  <p className="text-sm text-gray-400">Parameters, commands, and workflows</p>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Performance</h3>
                  <p className="text-sm text-gray-400">Speed, memory, and optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed FAQ Sections */}
        <div className="space-y-8">

          {/* Installation FAQ */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Installation Questions</h3>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Q1 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: Which installation method should I choose?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    <strong className="text-blue-400">Docker (Recommended)</strong> for most users - it's easier and includes everything pre-configured.
                    <strong className="text-yellow-400 ml-2">Local installation</strong> only if you're a developer or need custom modifications.
                  </div>
                </div>
              </details>

              {/* Q2 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: Do I need a GPU to run AlignAIR?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    No, but it's <strong className="text-green-400">highly recommended</strong>. AlignAIR can run on CPU but will be significantly slower.
                    For best performance, use an NVIDIA GPU with CUDA 11+ support.
                  </div>
                </div>
              </details>

              {/* Q3 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: The Docker image is very large. Is this normal?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    Yes, the image includes PyTorch, CUDA libraries, and pre-trained models. Expect 3-5GB download size.
                    This is normal for deep learning applications.
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Usage FAQ */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Usage Questions</h3>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Q1 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: What input file formats are supported?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    AlignAIR supports <strong className="text-green-400">CSV, TSV, and FASTA</strong> formats.
                    For CSV/TSV files, ensure there's a column named <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">"sequence"</code> containing your nucleotide sequences.
                  </div>
                </div>
              </details>

              {/* Q2 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: How do I choose the right threshold values?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    Start with defaults: <strong className="text-purple-400">V=0.75, D=0.3, J=0.8</strong>.
                    For high-quality data, increase thresholds for more stringent calls.
                    For noisy data, decrease slightly. See our <a href="/docs/technical/thresholding" className="text-blue-400 hover:underline">thresholding guide</a> for details.
                  </div>
                </div>
              </details>

              {/* Q3 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: Should I use heavy or light chain models?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    Choose based on your data:
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• <strong className="text-blue-400">Heavy chain</strong>: Use <code className="bg-gray-800 text-cyan-400 px-1 rounded">IGH_S5F_576</code> for IGH sequences</li>
                      <li>• <strong className="text-teal-400">Light chain</strong>: Use <code className="bg-gray-800 text-teal-400 px-1 rounded">IGL_S5F_576</code> for IGL/IGK sequences</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Q4 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: My sequences are longer than 576 nucleotides. What happens?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    AlignAIR automatically trims sequences to the maximum input size (default 576 nt) during preprocessing.
                    The trimming preserves the most informative regions for V(D)J assignment.
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Performance FAQ */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Performance Questions</h3>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Q1 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: How can I speed up processing?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    <strong className="text-green-400">Performance tips:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Increase batch size: <code className="bg-gray-800 text-green-400 px-1 rounded">--batch-size=4096</code></li>
                      <li>• Use GPU instead of CPU</li>
                      <li>• Process sequences in similar length groups</li>
                      <li>• Ensure sufficient GPU memory</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Q2 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: AlignAIR is running out of memory. What can I do?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    <strong className="text-yellow-400">Memory optimization:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Reduce batch size: <code className="bg-gray-800 text-yellow-400 px-1 rounded">--batch-size=512</code></li>
                      <li>• Split large datasets into smaller files</li>
                      <li>• Close other GPU-intensive applications</li>
                      <li>• Use CPU mode for very large datasets</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Q3 */}
              <details className="group bg-black rounded-lg border border-gray-700">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="text-white font-medium">Q: How long should processing take?</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="pt-4 text-gray-300">
                    <strong className="text-purple-400">Typical processing times:</strong>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>1K sequences (GPU):</span>
                        <span className="text-green-400">~30 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10K sequences (GPU):</span>
                        <span className="text-green-400">~3-5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>100K sequences (GPU):</span>
                        <span className="text-yellow-400">~30-60 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CPU processing:</span>
                        <span className="text-red-400">~10x slower</span>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Error Codes Reference */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-red-900 to-pink-900 rounded-2xl p-8 border border-red-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-red-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Common Error Messages</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-red-300 mb-4">File & Path Errors</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-400 font-mono text-sm mb-1">FileNotFoundError: No such file or directory</div>
                    <div className="text-gray-300 text-sm">Check your file paths and ensure volume mounting is correct</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-400 font-mono text-sm mb-1">KeyError: 'sequence'</div>
                    <div className="text-gray-300 text-sm">Your CSV file must have a column named "sequence"</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-red-300 mb-4">CUDA & Memory Errors</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-400 font-mono text-sm mb-1">CUDA out of memory</div>
                    <div className="text-gray-300 text-sm">Reduce batch size or use CPU mode</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-red-400 font-mono text-sm mb-1">No CUDA-capable device detected</div>
                    <div className="text-gray-300 text-sm">Install NVIDIA drivers or use CPU mode</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-blue-700">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-blue-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-300 mb-6">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/MuteJester/AlignAIR/issues" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report an Issue
              </a>
              <a href="https://github.com/MuteJester/AlignAIR/discussions" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Join Discussion
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}