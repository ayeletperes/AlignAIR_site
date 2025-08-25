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
  }, {} as Record<string, typeof AVAILABLE_MODELS>);

  const getChainDisplayName = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return 'Heavy Chain';
      case 'light': return 'Light Chain';
      case 'trb': return 'T-Cell Receptor Beta';
      default: return chainType;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <a href="/docs" className="hover:text-gray-700 dark:hover:text-gray-300">Docs</a>
          {' > '}
          <span className="text-gray-900 dark:text-white">Models</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Available Models
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore the different models available in AlignAIR for immunoglobulin and TCR sequence analysis.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(modelsByChain).map(([chainType, models]) => (
          <div key={chainType} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {getChainDisplayName(chainType)} Models
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {models.map((model) => (
                <div 
                  key={model.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {model.name} {model.version}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {model.species} • {model.referenceSet}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-200">
                      {model.version}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {model.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {model.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                    {model.features.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300">
                        +{model.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/docs/models/${model.id}`}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                    >
                      View Documentation →
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {model.lastUpdated}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Model Comparison */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Model Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Model</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Chain Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Version</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference Set</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Features</th>
              </tr>
            </thead>
            <tbody>
              {AVAILABLE_MODELS.map((model) => (
                <tr key={model.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <Link
                      href={`/docs/models/${model.id}`}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                    >
                      {model.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {getChainDisplayName(model.chainType)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-200">
                      {model.version}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {model.referenceSet}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {model.features.length} features
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Getting Started
        </h2>
        <div className="text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            <strong>New to AlignAIR?</strong> Start with our{' '}
            <Link href="/docs/installation" className="underline hover:no-underline">
              installation guide
            </Link>{' '}
            and{' '}
            <Link href="/docs/examples" className="underline hover:no-underline">
              examples
            </Link>.
          </p>
          <p>
            <strong>Ready to analyze sequences?</strong> Visit the{' '}
            <Link href="/alignair" className="underline hover:no-underline">
              AlignAIR application
            </Link>{' '}
            to start processing your sequences.
          </p>
        </div>
      </div>
    </div>
  );
} 