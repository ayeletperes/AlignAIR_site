export const metadata = {
  title: 'API Reference | AlignAIR Docs',
  description: 'Complete API reference for AlignAIR parameters, input formats, and output schemas.',
}

import Link from 'next/link'

export default function APIReferencePage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              API Reference
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Complete reference for AlignAIR command-line interface, parameters, input formats, and output schemas.
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-16">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">📖 Quick Navigation</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="#cli-interface" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                CLI Interface
              </a>
              <a href="#parameters" className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Parameters
              </a>
              <a href="#input-formats" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Input Formats
              </a>
              <a href="#output-schema" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Output Schema
              </a>
            </div>
          </div>
        </div>

        {/* CLI Interface */}
        <div id="cli-interface" className="mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 border border-blue-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Command Line Interface</h2>
            </div>

            <div className="space-y-6">

              {/* Basic Syntax */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Basic Syntax</h3>
                <div className="bg-black rounded-lg p-4 border border-gray-600">
                  <pre className="text-green-400 font-mono text-sm">
python app.py [COMMAND] [OPTIONS]
                  </pre>
                </div>
              </div>

              {/* Available Commands */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Available Commands</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-blue-400 font-mono text-lg">run</code>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Primary</span>
                    </div>
                    <p className="text-gray-300 text-sm">Execute AlignAIR sequence analysis with specified parameters</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-blue-400 font-mono text-lg">--help</code>
                      <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">Utility</span>
                    </div>
                    <p className="text-gray-300 text-sm">Display help information and parameter list</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-blue-400 font-mono text-lg">--version</code>
                      <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">Utility</span>
                    </div>
                    <p className="text-gray-300 text-sm">Show AlignAIR version information</p>
                  </div>
                </div>
              </div>

              {/* Exit Codes */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Exit Codes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <code className="text-green-400 font-mono">0</code>
                      <span className="text-green-400 text-sm">Success</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <code className="text-red-400 font-mono">1</code>
                      <span className="text-red-400 text-sm">General Error</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <code className="text-yellow-400 font-mono">2</code>
                      <span className="text-yellow-400 text-sm">Invalid Arguments</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <code className="text-orange-400 font-mono">3</code>
                      <span className="text-orange-400 text-sm">File Not Found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Reference */}
        <div id="parameters" className="mb-16">
          <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-8 border border-green-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Complete Parameters Reference</h2>
            </div>

            <div className="space-y-8">

              {/* Required Parameters */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Required Parameters
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="py-3 px-4 text-left text-white font-medium">Parameter</th>
                        <th className="py-3 px-4 text-left text-white font-medium">Type</th>
                        <th className="py-3 px-4 text-left text-white font-medium">Description</th>
                        <th className="py-3 px-4 text-left text-white font-medium">Example</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900">
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4">
                          <code className="text-red-400 bg-gray-800 px-2 py-1 rounded">--model-checkpoint</code>
                        </td>
                        <td className="py-3 px-4 text-gray-300">string</td>
                        <td className="py-3 px-4 text-gray-300">Path to trained model weights</td>
                        <td className="py-3 px-4">
                          <code className="text-green-400 text-xs">/app/pretrained_models/IGH_S5F_576</code>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4">
                          <code className="text-red-400 bg-gray-800 px-2 py-1 rounded">--chain-type</code>
                        </td>
                        <td className="py-3 px-4 text-gray-300">choice</td>
                        <td className="py-3 px-4 text-gray-300">heavy | light</td>
                        <td className="py-3 px-4">
                          <code className="text-green-400 text-xs">heavy</code>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4">
                          <code className="text-red-400 bg-gray-800 px-2 py-1 rounded">--sequences</code>
                        </td>
                        <td className="py-3 px-4 text-gray-300">string</td>
                        <td className="py-3 px-4 text-gray-300">Path to input sequence file</td>
                        <td className="py-3 px-4">
                          <code className="text-green-400 text-xs">/data/input/sequences.csv</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <code className="text-red-400 bg-gray-800 px-2 py-1 rounded">--save-path</code>
                        </td>
                        <td className="py-3 px-4 text-gray-300">string</td>
                        <td className="py-3 px-4 text-gray-300">Output directory path</td>
                        <td className="py-3 px-4">
                          <code className="text-green-400 text-xs">/data/output</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Optional Parameters */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Optional Parameters
                </h3>

                <div className="space-y-6">

                  {/* Model Configuration */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Model Configuration</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-blue-400">--max-input-size</code>
                          <span className="text-gray-300">int (default: 576)</span>
                          <span className="text-gray-300">Maximum sequence length</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-blue-400">--batch-size</code>
                          <span className="text-gray-300">int (default: 2048)</span>
                          <span className="text-gray-300">Processing batch size</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Threshold Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Threshold Settings</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-purple-400">--v-allele-threshold</code>
                          <span className="text-gray-300">float (default: 0.75)</span>
                          <span className="text-gray-300">V gene threshold</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-purple-400">--d-allele-threshold</code>
                          <span className="text-gray-300">float (default: 0.3)</span>
                          <span className="text-gray-300">D gene threshold</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-purple-400">--j-allele-threshold</code>
                          <span className="text-gray-300">float (default: 0.8)</span>
                          <span className="text-gray-300">J gene threshold</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-purple-400">--v-cap / --d-cap / --j-cap</code>
                          <span className="text-gray-300">int (default: 3)</span>
                          <span className="text-gray-300">Maximum calls per gene</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Options */}
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">Processing Options</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-yellow-400">--airr-format</code>
                          <span className="text-gray-300">flag</span>
                          <span className="text-gray-300">Output full AIRR schema</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-yellow-400">--fix-orientation</code>
                          <span className="text-gray-300">flag</span>
                          <span className="text-gray-300">Auto-correct sequence orientation</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-yellow-400">--translate-to-asc</code>
                          <span className="text-gray-300">flag</span>
                          <span className="text-gray-300">Use ASC allele names</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <code className="text-yellow-400">--save-predict-object</code>
                          <span className="text-gray-300">flag</span>
                          <span className="text-gray-300">Save raw predictions for debugging</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Formats */}
        <div id="input-formats" className="mb-16">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 border border-purple-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Input Formats</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* CSV Format */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-600 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">CSV Format</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Required Column:</div>
                    <code className="text-green-400 text-sm">sequence</code>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Example:</div>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`sequence_id,sequence
seq_001,CAGGTGCAGCTG...
seq_002,GAGGTGCAGCTG...`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* TSV Format */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">TSV Format</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Delimiter:</div>
                    <code className="text-blue-400 text-sm">Tab-separated</code>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Example:</div>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`sequence_id	sequence
seq_001	CAGGTGCAGCTG...
seq_002	GAGGTGCAGCTG...`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* FASTA Format */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-600 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">FASTA Format</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Standard Format:</div>
                    <code className="text-yellow-400 text-sm">&gt;header</code>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Example:</div>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`>seq_001
CAGGTGCAGCTGGTGGAG...
>seq_002
GAGGTGCAGCTGGTGGAG...`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Validation */}
            <div className="mt-8 bg-black/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Input Validation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-300 mb-3">✅ Valid Sequences</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• DNA nucleotides: A, T, G, C</li>
                    <li>• IUPAC ambiguous codes: N, R, Y, etc.</li>
                    <li>• Minimum length: 50 nucleotides</li>
                    <li>• Maximum length: Auto-trimmed to max-input-size</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-300 mb-3">❌ Invalid Sequences</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Protein sequences (amino acids)</li>
                    <li>• Empty or whitespace-only sequences</li>
                    <li>• Sequences with invalid characters</li>
                    <li>• Extremely short sequences (less than 50 nt)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Schema */}
        <div id="output-schema" className="mb-16">
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-2xl p-8 border border-yellow-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-yellow-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Output Schema</h2>
            </div>

            <div className="space-y-8">

              {/* Standard Output */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Standard Output Columns</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">sequence_id</div>
                      <div className="text-gray-300">string</div>
                      <div className="text-gray-300">Unique sequence identifier</div>
                      <div><code className="text-green-400 text-xs">seq_001</code></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">v_call</div>
                      <div className="text-gray-300">string</div>
                      <div className="text-gray-300">V gene assignment(s)</div>
                      <div><code className="text-green-400 text-xs">IGHV1-2*01</code></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">d_call</div>
                      <div className="text-gray-300">string</div>
                      <div className="text-gray-300">D gene assignment(s)</div>
                      <div><code className="text-green-400 text-xs">IGHD3-3*01</code></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">j_call</div>
                      <div className="text-gray-300">string</div>
                      <div className="text-gray-300">J gene assignment(s)</div>
                      <div><code className="text-green-400 text-xs">IGHJ4*01</code></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">productive</div>
                      <div className="text-gray-300">boolean</div>
                      <div className="text-gray-300">Sequence productivity status</div>
                      <div><code className="text-green-400 text-xs">True</code></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium text-yellow-400">sequence</div>
                      <div className="text-gray-300">string</div>
                      <div className="text-gray-300">Input sequence (preserved)</div>
                      <div><code className="text-green-400 text-xs">CAGGTG...</code></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AIRR Format */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">AIRR Schema Output (--airr-format)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Additional Columns</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">sequence_alignment</code> - Aligned sequence</li>
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">germline_alignment</code> - Germline reference</li>
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">v_sequence_start</code> - V region start position</li>
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">v_sequence_end</code> - V region end position</li>
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">d_sequence_start</code> - D region start position</li>
                      <li>• <code className="text-blue-400 bg-gray-800 px-1 rounded">d_sequence_end</code> - D region end position</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-3">Standardized Fields</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">j_sequence_start</code> - J region start position</li>
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">j_sequence_end</code> - J region end position</li>
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">cdr3</code> - CDR3 sequence</li>
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">cdr3_aa</code> - CDR3 amino acid sequence</li>
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">mutation_count</code> - Number of mutations</li>
                      <li>• <code className="text-green-400 bg-gray-800 px-1 rounded">sequence_length</code> - Total sequence length</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Types */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Data Types & Formats</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Gene Calls</h4>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Single call:</div>
                      <code className="text-purple-400 text-sm">IGHV1-2*01</code>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 mt-2">
                      <div className="text-xs text-gray-400 mb-1">Multiple calls:</div>
                      <code className="text-purple-400 text-sm">IGHV1-2*01,IGHV1-3*01</code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-orange-300 mb-3">Coordinates</h4>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">1-indexed positions:</div>
                      <code className="text-orange-400 text-sm">v_start: 1, v_end: 285</code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-pink-300 mb-3">Sequences</h4>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Uppercase nucleotides:</div>
                      <code className="text-pink-400 text-sm">CAGGTGCAGCTG...</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Quick Reference */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 border border-indigo-700">
            <h2 className="h2 mb-6 text-white">📋 Quick Reference Card</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-black/50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-300 mb-2">Minimal Command</h3>
                <code className="text-green-400 text-xs">
                  python app.py run --model-checkpoint=... --chain-type=... --sequences=... --save-path=...
                </code>
              </div>

              <div className="bg-black/50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-green-300 mb-2">High Stringency</h3>
                <code className="text-green-400 text-xs">
                  --v-allele-threshold=0.9 --j-allele-threshold=0.9 --v-cap=1 --j-cap=1
                </code>
              </div>

              <div className="bg-black/50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Large Datasets</h3>
                <code className="text-green-400 text-xs">
                  --batch-size=4096 --fix-orientation
                </code>
              </div>

              <div className="bg-black/50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Full Output</h3>
                <code className="text-green-400 text-xs">
                  --airr-format --save-predict-object
                </code>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/docs/examples" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View More Examples
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}