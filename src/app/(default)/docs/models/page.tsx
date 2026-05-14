import React from 'react';
import { AVAILABLE_MODELS } from '@/lib/model/modelMetadataLoader';
import Link from 'next/link';

export default function ModelsPage() {
  const modelsByChain = AVAILABLE_MODELS.reduce((acc, model) => {
    if (!acc[model.chainType]) {
      acc[model.chainType] = [];
    }
    acc[model.chainType].push(model);
    return acc;
  }, {} as Record<string, any[]>);

  const getChainDisplayName = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return 'Heavy Chain';
      case 'light': return 'Light Chain';
      case 'trb': return 'T-Cell Receptor Beta';
      default: return chainType;
    }
  };

  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // models
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Available Models
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Pre-trained models available in AlignAIR for immunoglobulin and TCR sequence analysis.
          </p>
        </div>

        {/* Per-chain groups */}
        <div className="py-12 space-y-12">
          {Object.entries(modelsByChain).map(([chainType, models]) => (
            <div key={chainType}>
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                // {chainType}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {getChainDisplayName(chainType)}
              </h2>

              <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="bg-white dark:bg-black p-5 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {model.name}
                        </h3>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">
                          {model.species} · {model.referenceSet}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-mono bg-purple-50 text-purple-700 rounded dark:bg-purple-900/30 dark:text-purple-300">
                        {model.version}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {model.features.slice(0, 3).map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded dark:bg-gray-800 dark:text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                      {model.features.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded dark:bg-gray-800 dark:text-gray-300">
                          +{model.features.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/docs/models/${model.id}`}
                        className="text-sm text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-medium"
                      >
                        View docs →
                      </Link>
                      <span className="text-xs font-mono text-gray-500">
                        {model.lastUpdated}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // comparison
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Model comparison
          </h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="text-left py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Model</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Chain</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Version</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Reference set</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Features</th>
                  </tr>
                </thead>
                <tbody>
                  {AVAILABLE_MODELS.map((model) => (
                    <tr key={model.id} className="border-b border-gray-100 dark:border-gray-900 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-950">
                      <td className="py-3 px-5">
                        <Link
                          href={`/docs/models/${model.id}`}
                          className="text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-medium"
                        >
                          {model.name}
                        </Link>
                      </td>
                      <td className="py-3 px-5 text-gray-700 dark:text-gray-300">
                        {getChainDisplayName(model.chainType)}
                      </td>
                      <td className="py-3 px-5">
                        <span className="px-2 py-0.5 text-xs font-mono bg-purple-50 text-purple-700 rounded dark:bg-purple-900/30 dark:text-purple-300">
                          {model.version}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-gray-700 dark:text-gray-300">
                        {model.referenceSet}
                      </td>
                      <td className="py-3 px-5 text-gray-500 dark:text-gray-500 font-mono text-xs">
                        {model.features.length} features
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Getting started */}
        <div className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // next
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Getting started
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-gray-900 dark:text-white">New to AlignAIR?</strong> Start with the{' '}
              <Link href="/docs/installation" className="text-purple-700 dark:text-purple-400 underline underline-offset-2">installation guide</Link>{' '}
              and{' '}
              <Link href="/docs/examples" className="text-purple-700 dark:text-purple-400 underline underline-offset-2">examples</Link>.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Ready to analyze?</strong> Visit the{' '}
              <Link href="/alignair" className="text-purple-700 dark:text-purple-400 underline underline-offset-2">AlignAIR application</Link>.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
