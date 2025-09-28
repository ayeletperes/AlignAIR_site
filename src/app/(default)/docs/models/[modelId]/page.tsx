import React from 'react';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // Return an array of all model IDs you want to statically generate
  return [
    { modelId: 'IGH_S5F_576' },
    { modelId: 'IGH_S5F_576_Extended' },
    { modelId: 'IGL_S5F_576' },
    { modelId: 'IGL_S5F_576_OGRDB' },
    { modelId: 'TCRB_UNIFORM_576' },
    { modelId: 'IGH_AlignAIR_RHESUS_MACAQUE' },
  ];
}

interface ModelDocPageProps {
  params: {
    modelId: string;
  };
}

export default async function ModelDocPage({ params }: ModelDocPageProps) {
  const model = await getModelById(params.modelId);
  
  if (!model) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <a href="/docs" className="hover:text-gray-700 dark:hover:text-gray-300">Docs</a>
          {' > '}
          <a href="/docs/models" className="hover:text-gray-700 dark:hover:text-gray-300">Models</a>
          {' > '}
          <span className="text-gray-900 dark:text-white">{model.name}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {model.name} {model.version}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          {model.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Model Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Model Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Chain Type</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{model.chainType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Species</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{model.species}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reference Set</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{model.referenceSet}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{model.lastUpdated}</dd>
            </div>
          </dl>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Features
          </h2>
          <ul className="space-y-2">
            {model.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-900 dark:text-white">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Usage Instructions
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Select "{model.chainType}" as your chain type in the model selector</li>
            <li>Choose "{model.name} {model.version}" from the available models</li>
            <li>Input your sequence or upload a FASTA file</li>
            <li>Adjust parameters as needed (V/D/J caps and thresholds)</li>
            <li>Click "Start Alignment Analysis" to begin processing</li>
          </ol>
        </div>
      </div>

      {/* Performance Notes */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Performance Notes
        </h2>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            <strong>Model Size:</strong> This model requires approximately 200-300MB of memory during processing.
          </p>
          <p>
            <strong>Processing Time:</strong> Typical processing time is 5-15 seconds per sequence, depending on sequence length and complexity.
          </p>
          <p>
            <strong>Browser Compatibility:</strong> Works best in modern browsers with WebGL support for optimal performance.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Related Documentation
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/docs/installation" 
            className="block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Installation Guide</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to set up AlignAIR</p>
          </a>
          <a 
            href="/docs/api" 
            className="block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">API Reference</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Programmatic access to models</p>
          </a>
          <a 
            href="/docs/examples" 
            className="block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Examples</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See practical usage examples</p>
          </a>
          <a 
            href="/docs/faq" 
            className="block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">FAQ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Common questions and answers</p>
          </a>
        </div>
      </div>
    </div>
  );
} 