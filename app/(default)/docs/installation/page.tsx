export const metadata = {
  title: 'Installation | AlignAIR Docs',
  description: 'How to install and run AlignAIR using Docker or local installation.',
}

export default function InstallationPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Installation Guide</h1>
            <p className="text-xl text-gray-400 mb-8">
              Get AlignAIR up and running in minutes with our step-by-step installation guide.
            </p>
          </div>
        </div>

        {/* Installation Method Cards */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Choose Your Installation Method</h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Docker Installation */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-8 h-full">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Docker Installation</h3>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Recommended</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  The easiest way to run AlignAIR. Everything is pre-configured and ready to use.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No manual setup required
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Consistent environment across platforms
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pre-trained models included
                  </div>
                </div>
              </div>
            </div>

            {/* Local Installation */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-8 h-full">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-yellow-600 rounded-xl mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Local Installation</h3>
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Advanced</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  Install AlignAIR directly on your system. Recommended for developers and advanced users.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Full control over environment
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Easier integration with workflows
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Requires manual configuration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Docker Installation Steps */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-blue-700">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-blue-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Docker Installation Steps</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Step 1 */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                  <h3 className="text-xl font-bold text-white">Verify Docker</h3>
                </div>
                <p className="text-gray-300 mb-4">Make sure Docker is installed and running:</p>
                <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                  <pre className="text-green-400 font-mono text-sm">docker --version</pre>
                  <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  Expected: Docker version 20.10+
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                  <h3 className="text-xl font-bold text-white">Pull AlignAIR Image</h3>
                </div>
                <p className="text-gray-300 mb-4">Download the latest AlignAIR image:</p>
                <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                  <pre className="text-green-400 font-mono text-sm">docker pull thomask90/alignair:latest</pre>
                  <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  This may take a few minutes depending on your connection
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                  <h3 className="text-xl font-bold text-white">Prepare Data Directory</h3>
                </div>
                <p className="text-gray-300 mb-4">Create directories for your data:</p>
                <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                  <pre className="text-green-400 font-mono text-sm">mkdir -p ~/alignair-data/input ~/alignair-data/output</pre>
                  <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  Place your input files in ~/alignair-data/input/
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                  <h3 className="text-xl font-bold text-white">Run Container</h3>
                </div>
                <p className="text-gray-300 mb-4">Start AlignAIR with volume mounting:</p>
                <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                  <pre className="text-green-400 font-mono text-xs">docker run -it --rm -v ~/alignair-data:/data thomask90/alignair:latest</pre>
                  <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  You should see the AlignAIR command prompt
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">System Requirements</h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Recommended */}
            <div className="bg-green-900/30 rounded-2xl p-6 border border-green-700">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-600 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-300">Recommended Setup</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <div>
                    <div className="text-green-300 font-medium">NVIDIA GPU</div>
                    <div className="text-green-200 text-sm">CUDA 11+ support for optimal performance</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <div>
                    <div className="text-green-300 font-medium">16GB+ RAM</div>
                    <div className="text-green-200 text-sm">For large batch processing</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-green-300 font-medium">10GB+ Storage</div>
                    <div className="text-green-200 text-sm">For models and datasets</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum */}
            <div className="bg-yellow-900/30 rounded-2xl p-6 border border-yellow-700">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-yellow-600 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-yellow-300">Minimum Requirements</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <div>
                    <div className="text-yellow-300 font-medium">Multi-core CPU</div>
                    <div className="text-yellow-200 text-sm">CPU mode available (slower)</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <div>
                    <div className="text-yellow-300 font-medium">8GB+ RAM</div>
                    <div className="text-yellow-200 text-sm">For basic processing</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-yellow-300 font-medium">5GB+ Storage</div>
                    <div className="text-yellow-200 text-sm">Minimum free space</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Local Installation */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-2xl p-8 border border-yellow-700">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-yellow-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Local Installation (Advanced)</h2>
            </div>

            <div className="space-y-6">

              {/* Prerequisites */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-white font-medium mb-2">Python 3.8+</div>
                    <div className="bg-black rounded p-2">
                      <code className="text-green-400 text-sm">python --version</code>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-white font-medium mb-2">Git</div>
                    <div className="bg-black rounded p-2">
                      <code className="text-green-400 text-sm">git --version</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Installation Steps</h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-gray-300 mb-2">1. Clone the repository:</div>
                    <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-sm">git clone https://github.com/MuteJester/AlignAIR.git</pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-300 mb-2">2. Navigate to directory and install dependencies:</div>
                    <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-sm">cd AlignAIR
pip install -r requirements.txt</pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-300 mb-2">3. Verify installation:</div>
                    <div className="bg-black rounded-lg p-4 border border-gray-600 relative group">
                      <pre className="text-green-400 font-mono text-sm">python app.py --help</pre>
                      <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-800/30 rounded-lg p-4 border border-yellow-600">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <div className="text-yellow-300 font-medium mb-1">⚠️ Note for Advanced Users</div>
                    <div className="text-yellow-200 text-sm">
                      This method requires a properly configured Python environment and is recommended for developers only.
                      You'll need to manually download model weights and configure paths.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links & Next Steps */}
        <div className="mb-16">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="h2 text-center mb-8 text-white">What's Next?</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <a href="/docs/usage" className="group bg-blue-900/30 hover:bg-blue-900/50 rounded-xl p-6 border border-blue-700 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-xl font-bold text-blue-300 group-hover:text-blue-200">Usage Guide</h3>
                </div>
                <p className="text-blue-200 text-sm">
                  Learn how to run AlignAIR with different parameters and configurations.
                </p>
              </a>

              <a href="/docs/technical" className="group bg-purple-900/30 hover:bg-purple-900/50 rounded-xl p-6 border border-purple-700 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <h3 className="text-xl font-bold text-purple-300 group-hover:text-purple-200">Technical Details</h3>
                </div>
                <p className="text-purple-200 text-sm">
                  Dive deep into the architecture and algorithms behind AlignAIR.
                </p>
              </a>

              <a href="https://github.com/MuteJester/AlignAIR" className="group bg-gray-800 hover:bg-gray-700 rounded-xl p-6 border border-gray-600 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-300 group-hover:text-gray-200">GitHub Repository</h3>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300">
                  Access the source code, report issues, and contribute to the project.
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Installation Complete */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-2xl p-8 border border-green-500">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-green-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Ready to Get Started!</h2>
            <p className="text-xl text-gray-300 mb-6">
              AlignAIR is now installed and ready to process your sequence data. Check out the usage guide to run your first analysis.
            </p>
            <a href="/docs/usage" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Using AlignAIR
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}