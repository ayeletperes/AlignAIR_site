"use client"

import { useState } from 'react'

export default function ModelsPage() {
  const [copiedId, setCopiedId] = useState(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const models = [
    {
      id: 'igh',
      name: 'IGH Heavy Chain',
      checkpoint: '/app/pretrained_models/IGH_S5F_576',
      chainType: 'heavy',
      species: 'Human',
      referenceSet: 'OGRDB V8 extended',
      lastUpdated: 'February 2025',
      description: 'Immunoglobulin Heavy Chain model trained on S5F mutation patterns',
      features: ['V/D/J segmentation', 'Allele calling', 'Mutation prediction', 'Productivity assessment'],
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'bg-blue-600'
    },
    {
      id: 'igl',
      name: 'IGL/IGK Light Chain',
      checkpoint: '/app/pretrained_models/IGL_S5F_576',
      chainType: 'light',
      species: 'Human',
      referenceSet: 'OGRDB V2 & V3 extended',
      lastUpdated: 'March 2025',
      description: 'Immunoglobulin Lambda Light Chain model with enhanced V/J prediction',
      features: ['V/J segmentation', 'Allele calling', 'Mutation prediction', 'Productivity assessment'],
      gradient: 'from-green-500 to-teal-500',
      iconColor: 'bg-green-600'
    },
    {
      id: 'tcrb',
      name: 'TCRB Beta Chain',
      checkpoint: '/app/pretrained_models/TCRB_UNIFORM_576',
      chainType: 'tcrb',
      species: 'Human',
      referenceSet: 'IMGT 2022',
      lastUpdated: 'July 2025',
      description: 'T Cell Receptor Beta Chain model optimized for TCR repertoire analysis',
      features: ['V/D/J segmentation', 'Allele calling', 'Productivity assessment'],
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'bg-purple-600'
    }
  ]

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H9M7 7V3m0 18v-4M3 12h18m-9 4h6m-6-8h6" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Supported Models
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              AlignAIR ships with pre-trained models for human B-cell and T-cell receptor analysis.
              Each model is optimized for specific chain types and comes ready to use in the Docker container.
            </p>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-600 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Quick Reference</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {models.map((model) => (
                <div key={model.id} className="bg-black/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 ${model.iconColor} rounded-lg mr-3`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.5 3l4.5 6H8.5l3 7-6-7h3L5.5 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{model.name}</div>
                      <div className="text-gray-400 text-xs">--chain-type={model.chainType}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <code className="text-green-400 text-xs break-all">{model.checkpoint}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Model Cards */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Model Details</h2>

          <div className="space-y-8">
            {models.map((model) => (
              <div key={model.id} className={`bg-gradient-to-br ${model.gradient} p-0.5 rounded-2xl`}>
                <div className="bg-gray-900 rounded-2xl p-8 h-full">
                  <div className="grid lg:grid-cols-3 gap-8">

                    {/* Model Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center mb-6">
                        <div className={`p-3 ${model.iconColor} rounded-xl mr-4`}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.5 3l4.5 6H8.5l3 7-6-7h3L5.5 3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{model.name}</h3>
                          <p className="text-gray-400">{model.description}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3">Key Features</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {model.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center">
                              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Usage Example */}
                      <div className="bg-black rounded-lg p-4 border border-gray-700 relative group">
                        <div className="text-sm text-gray-400 mb-2">Usage Example:</div>
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
{`python app.py run \\
  --model-checkpoint=${model.checkpoint} \\
  --chain-type=${model.chainType} \\
  --sequences=/data/input/sequences.csv \\
  --save-path=/data/output`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(`python app.py run --model-checkpoint=${model.checkpoint} --chain-type=${model.chainType} --sequences=/data/input/sequences.csv --save-path=/data/output`, model.id)}
                          className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === model.id ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="text-white font-semibold mb-4">Model Metadata</h4>
                      <div className="space-y-4">

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Checkpoint Path</div>
                          <div className="bg-gray-800 rounded p-2 mt-1 relative group">
                            <code className="text-green-400 text-sm break-all">{model.checkpoint}</code>
                            <button
                              onClick={() => copyToClipboard(model.checkpoint, `${model.id}-path`)}
                              className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedId === `${model.id}-path` ? (
                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Chain Type</div>
                          <div className="text-white font-medium">{model.chainType}</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Species</div>
                          <div className="text-white font-medium">{model.species}</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Reference Set</div>
                          <div className="text-white font-medium">{model.referenceSet}</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Last Updated</div>
                          <div className="text-white font-medium">{model.lastUpdated}</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400">Input Size</div>
                          <div className="text-white font-medium">576 nucleotides</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Model Comparison</h2>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-400 text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Model</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Chain Type</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Segments</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Reference</th>
                    <th className="py-4 px-6 border-b border-gray-700 text-white font-bold">Use Case</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-white font-medium">IGH Heavy Chain</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-blue-400 px-2 py-1 rounded">heavy</code>
                    </td>
                    <td className="py-3 px-6">V, D, J</td>
                    <td className="py-3 px-6">OGRDB V8 extended</td>
                    <td className="py-3 px-6">B-cell heavy chain analysis</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-white font-medium">IGL/IGK Light Chain</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">light</code>
                    </td>
                    <td className="py-3 px-6">V, J</td>
                    <td className="py-3 px-6">OGRDB V2 & V3 extended</td>
                    <td className="py-3 px-6">B-cell lambda/kappa light chain analysis</td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-white font-medium">TCRB Beta Chain</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">tcrb</code>
                    </td>
                    <td className="py-3 px-6">V, D, J</td>
                    <td className="py-3 px-6">IMGT 2020</td>
                    <td className="py-3 px-6">T-cell receptor beta chain analysis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Installation Note */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H9M7 7V3m0 18v-4" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">All Models Included</h2>
            </div>
            <p className="text-xl text-gray-400 mb-6">
              All models are pre-installed and ready to use when you pull the AlignAIR Docker container.
              No additional downloads or setup required.
            </p>
            <div className="bg-black rounded-lg p-4 border border-gray-700 inline-block">
              <pre className="text-green-400 font-mono text-sm">
docker pull thomask90/alignair:latest
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}