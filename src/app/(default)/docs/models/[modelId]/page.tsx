import React from 'react';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
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
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-10 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // models / {model.id.toLowerCase()}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
            {model.name} {model.version}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {model.description}
          </p>
        </div>

        {/* Info + Features grid */}
        <div className="py-10 grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
          <div className="bg-white dark:bg-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// information</div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Model information</h2>
            <dl className="space-y-3">
              {[
                { k: 'Chain Type', v: model.chainType },
                { k: 'Species', v: model.species },
                { k: 'Reference Set', v: model.referenceSet },
                { k: 'Last Updated', v: model.lastUpdated },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="text-xs font-mono uppercase tracking-widest text-gray-500">{row.k}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white dark:bg-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// features</div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <ul className="space-y-2">
              {model.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-green-700 dark:text-green-400 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Usage */}
        <div className="py-10 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// usage</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Usage instructions</h2>
          <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Select &quot;{model.chainType}&quot; as your chain type in the model selector</li>
            <li>Choose &quot;{model.name} {model.version}&quot; from the available models</li>
            <li>Input your sequence or upload a FASTA file</li>
            <li>Adjust parameters as needed (V/D/J caps and thresholds)</li>
            <li>Click &quot;Start Alignment Analysis&quot; to begin processing</li>
          </ol>
        </div>

        {/* Performance notes */}
        <div className="py-10 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-3">// performance notes</div>
          <div className="border-l-2 border-blue-300 dark:border-blue-800 pl-4 py-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-md space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong className="text-gray-900 dark:text-white">Model size:</strong> Approximately 200–300 MB of memory during processing.</p>
            <p><strong className="text-gray-900 dark:text-white">Processing time:</strong> Typically 5–15 seconds per sequence, depending on length and complexity.</p>
            <p><strong className="text-gray-900 dark:text-white">Browser compatibility:</strong> Works best in modern browsers with WebGL support.</p>
          </div>
        </div>

        {/* Related */}
        <div className="py-10 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// related</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Related documentation</h2>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {[
              { href: '/docs/installation', title: 'Installation Guide', body: 'Learn how to set up AlignAIR' },
              { href: '/docs/api', title: 'API Reference', body: 'Programmatic access to models' },
              { href: '/docs/examples', title: 'Examples', body: 'See practical usage examples' },
              { href: '/docs/faq', title: 'FAQ', body: 'Common questions and answers' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group block bg-white dark:bg-black p-5 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">{l.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{l.body}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
