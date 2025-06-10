export const metadata = {
  title: 'Usage | AlignAIR Docs',
  description: 'How to use AlignAIR via Docker and the CLI interface.',
}

export default function UsagePage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Usage Guide</h1>
            <p className="text-xl text-gray-400 mb-8">
              AlignAIR can be easily used through its Docker container interface, offering flexibility and speed for sequence alignment tasks.
            </p>
          </div>
        </div>


        {/* Quick Start Command */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-600 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Quick Start</h2>
            </div>

            <p className="text-xl text-gray-400 mb-6">
              After starting the AlignAIR Docker container, run the following command inside it:
            </p>

            <div className="bg-black rounded-lg p-6 border border-gray-700 relative group">
              <pre className="text-green-400 text-sm font-mono overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \
  --save-path=/data/output \
  --chain-type=heavy \
  --sequences=/app/tests/sample_HeavyChain_dataset.csv
              </pre>
              <button className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <p className="text-gray-400 mt-4">
              💡 <strong>Tip:</strong> Modify the parameters as needed to match your input and model requirements.
            </p>
          </div>
        </div>

        {/* Parameter Categories */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Parameter Categories</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Model Settings */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Model Settings</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">model_checkpoint</code> - Model weights path</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">chain_type</code> - Heavy or light chain</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">max_input_size</code> - Input window size</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">batch_size</code> - Sequences per batch</li>
                </ul>
              </div>
            </div>

            {/* Input/Output */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-600 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Input & Output</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-green-400">sequences</code> - Input file path</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-green-400">save_path</code> - Output directory</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-green-400">airr_format</code> - Full AIRR schema</li>
                </ul>
              </div>
            </div>

            {/* Thresholds */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-600 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Thresholds</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">v_allele_threshold</code> - V call threshold</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">d_allele_threshold</code> - D call threshold</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">j_allele_threshold</code> - J call threshold</li>
                  <li>• <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">v_cap / d_cap / j_cap</code> - Max calls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Parameter Table */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Complete Parameter Reference</h2>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-400 text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Parameter</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Description</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Default</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">

                  {/* Model Settings */}
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6 font-semibold text-blue-400 bg-blue-900/20" colSpan={3}>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        Model Settings
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded">model_checkpoint</code>
                    </td>
                    <td className="py-3 px-6">Path to model weights. Docker ships with IGH_S5F_576 and IGL_S5F_576</td>
                    <td className="py-3 px-6 text-gray-500">Required</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded">chain_type</code>
                    </td>
                    <td className="py-3 px-6">Specify heavy or light chain for alignment functionality</td>
                    <td className="py-3 px-6 text-gray-500">Required</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded">max_input_size</code>
                    </td>
                    <td className="py-3 px-6">Maximum input window size. Longer reads are trimmed during preprocessing</td>
                    <td className="py-3 px-6 text-green-400">576</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded">batch_size</code>
                    </td>
                    <td className="py-3 px-6">Number of sequences per batch. Larger values can improve runtime</td>
                    <td className="py-3 px-6 text-green-400">2048</td>
                  </tr>

                  {/* Input and Output */}
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6 font-semibold text-green-400 bg-green-900/20" colSpan={3}>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Input and Output
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">sequences</code>
                    </td>
                    <td className="py-3 px-6">Path to sequence file (CSV/TSV/FASTA). Must have a "sequence" column for tables</td>
                    <td className="py-3 px-6 text-gray-500">Required</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">save_path</code>
                    </td>
                    <td className="py-3 px-6">Path to save output (AIRR Schema CSV format)</td>
                    <td className="py-3 px-6 text-gray-500">Required</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">airr_format</code>
                    </td>
                    <td className="py-3 px-6">Output full AIRR Schema instead of essential columns only</td>
                    <td className="py-3 px-6 text-green-400">false</td>
                  </tr>

                  {/* Thresholds */}
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6 font-semibold text-purple-400 bg-purple-900/20" colSpan={3}>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Threshold Settings
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">v_allele_threshold</code>
                    </td>
                    <td className="py-3 px-6">Threshold for V allele calling. Higher values = more stringent</td>
                    <td className="py-3 px-6 text-green-400">0.75</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">d_allele_threshold</code>
                    </td>
                    <td className="py-3 px-6">Threshold for D allele calling. Lower due to D region complexity</td>
                    <td className="py-3 px-6 text-green-400">0.3</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">j_allele_threshold</code>
                    </td>
                    <td className="py-3 px-6">Threshold for J allele calling</td>
                    <td className="py-3 px-6 text-green-400">0.8</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">v_cap / d_cap / j_cap</code>
                    </td>
                    <td className="py-3 px-6">Maximum number of calls allowed for V/D/J alleles</td>
                    <td className="py-3 px-6 text-green-400">3</td>
                  </tr>

                  {/* Preprocessing */}
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6 font-semibold text-yellow-400 bg-yellow-900/20" colSpan={3}>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preprocessing and Corrections
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-yellow-400 px-2 py-1 rounded">translate_to_asc</code>
                    </td>
                    <td className="py-3 px-6">Output ASC alleles instead of IMGT names</td>
                    <td className="py-3 px-6 text-green-400">false</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-yellow-400 px-2 py-1 rounded">fix_orientation</code>
                    </td>
                    <td className="py-3 px-6">Automatically correct reverse/complement orientations before alignment</td>
                    <td className="py-3 px-6 text-green-400">true</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Example Commands */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Example Commands</h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Heavy Chain Example */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Heavy Chain Analysis</h3>
              </div>

              <div className="bg-black rounded-lg p-4 border border-gray-700 relative group">
                <pre className="text-green-400 text-xs font-mono overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \
  --chain-type=heavy \
  --sequences=/data/input/heavy_sequences.csv \
  --save-path=/data/output/heavy_results \
  --v-allele-threshold=0.75 \
  --d-allele-threshold=0.3 \
  --j-allele-threshold=0.8
                </pre>
                <button className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Light Chain Example */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-teal-600 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Light Chain Analysis</h3>
              </div>

              <div className="bg-black rounded-lg p-4 border border-gray-700 relative group">
                <pre className="text-green-400 text-xs font-mono overflow-x-auto">
python app.py run \
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \
  --chain-type=light \
  --sequences=/data/input/light_sequences.csv \
  --save-path=/data/output/light_results \
  --airr-format \
  --fix-orientation
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

        {/* Tips and Best Practices */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Tips & Best Practices</h2>

          <div className="grid md:grid-cols-3 gap-6">


            <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-bold text-blue-300">Performance</h3>
              </div>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>• Use larger batch sizes for better GPU utilization</li>
                <li>• Process sequences in batches of similar lengths</li>
                <li>• Monitor memory usage with large datasets</li>
              </ul>
            </div>

            <div className="bg-green-900/30 rounded-2xl p-6 border border-green-700">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-green-300">Accuracy</h3>
              </div>
              <ul className="space-y-2 text-green-200 text-sm">
                <li>• Use appropriate thresholds for your data quality</li>
                <li>• Enable orientation fixing for mixed datasets</li>
                <li>• Choose the correct chain type model</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-700">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-bold text-purple-300">Output</h3>
              </div>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>• Enable AIRR format for downstream analysis</li>
                <li>• Save prediction objects for debugging</li>
                <li>• Use meaningful output directory names</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="h2 mb-6 text-white">Ready for Advanced Usage?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Explore technical details, examples, and troubleshooting guides to get the most out of AlignAIR.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/docs/technical" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Technical Details
              </a>
              <a href="/docs/technical" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Examples
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}