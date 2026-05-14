import { Fragment } from 'react';

export const metadata = {
  title: 'Usage | AlignAIR Docs',
  description: 'How to use AlignAIR via Docker and the CLI interface.',
}

interface ParamRow {
  name: string;
  description: string;
  default: string;
}

interface ParamGroup {
  category: string;
  title: string;
  accent: 'cobalt' | 'green' | 'plum' | 'amber';
  rows: ParamRow[];
}

const accentMap = {
  cobalt: { text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  green: { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  plum: { text: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  amber: { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
};

const paramGroups: ParamGroup[] = [
  {
    category: 'model',
    title: 'Model settings',
    accent: 'cobalt',
    rows: [
      { name: 'model_checkpoint', description: 'Path to model weights. Docker ships with IGH_S5F_576 and IGL_S5F_576.', default: 'Required' },
      { name: 'chain_type', description: 'Heavy or light chain.', default: 'Required' },
      { name: 'max_input_size', description: 'Maximum input window size. Longer reads are trimmed during preprocessing.', default: '576' },
      { name: 'batch_size', description: 'Number of sequences per batch. Larger values can improve runtime.', default: '2048' },
    ],
  },
  {
    category: 'io',
    title: 'Input & output',
    accent: 'green',
    rows: [
      { name: 'sequences', description: 'Path to sequence file (CSV/TSV/FASTA). CSV/TSV must have a "sequence" column.', default: 'Required' },
      { name: 'save_path', description: 'Output directory (AIRR Schema CSV format).', default: 'Required' },
      { name: 'airr_format', description: 'Emit full AIRR Schema instead of essential columns only.', default: 'false' },
    ],
  },
  {
    category: 'thresholds',
    title: 'Thresholds',
    accent: 'plum',
    rows: [
      { name: 'v_allele_threshold', description: 'V call threshold. Higher = more stringent.', default: '0.75' },
      { name: 'd_allele_threshold', description: 'D call threshold. Lower due to D region complexity.', default: '0.3' },
      { name: 'j_allele_threshold', description: 'J call threshold.', default: '0.8' },
      { name: 'v_cap / d_cap / j_cap', description: 'Maximum number of calls allowed for V/D/J alleles.', default: '3' },
    ],
  },
  {
    category: 'preprocessing',
    title: 'Preprocessing & corrections',
    accent: 'amber',
    rows: [
      { name: 'translate_to_asc', description: 'Output ASC alleles instead of IMGT names.', default: 'false' },
      { name: 'fix_orientation', description: 'Automatically correct reverse/complement orientations before alignment.', default: 'true' },
    ],
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950 p-4 font-mono text-xs overflow-x-auto">
      <pre className="text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed">{children}</pre>
    </div>
  );
}

export default function UsagePage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // usage
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Usage Guide
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            AlignAIR ships as a Docker container with a CLI entry point. Run it locally, in CI, or on a cluster.
          </p>
        </div>

        {/* Quick start */}
        <div className="py-10 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // quickstart
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick start
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            After starting the AlignAIR Docker container, run the following command inside it:
          </p>
          <CodeBlock>{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \\
  --save-path=/data/output \\
  --chain-type=heavy \\
  --sequences=/app/tests/sample_HeavyChain_dataset.csv`}</CodeBlock>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-mono text-purple-700 dark:text-purple-400">tip</span> &nbsp;Modify the parameters to match your input and model.
          </p>
        </div>

        {/* Parameter categories overview */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // parameters
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Parameter categories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {paramGroups.map((g, i) => (
              <div key={g.category} className="bg-white dark:bg-black p-5">
                <div className={`text-xs font-mono uppercase tracking-widest ${accentMap[g.accent].text} mb-2`}>
                  0{i + 1} / {g.category}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">{g.title}</h3>
                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {g.rows.slice(0, 4).map((r) => (
                    <li key={r.name} className="truncate">{r.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Full parameter reference */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // reference
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Complete parameter reference
          </h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Parameter</th>
                    <th className="py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Description</th>
                    <th className="py-3 px-5 font-medium text-gray-900 dark:text-white font-mono uppercase text-xs tracking-wider">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {paramGroups.map((g) => (
                    <Fragment key={g.category}>
                      <tr className={`${accentMap[g.accent].bg} border-y border-gray-200 dark:border-gray-800`}>
                        <td colSpan={3} className={`py-2.5 px-5 font-mono text-xs uppercase tracking-widest ${accentMap[g.accent].text}`}>
                          {g.title}
                        </td>
                      </tr>
                      {g.rows.map((r) => (
                        <tr key={r.name} className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-950">
                          <td className="py-3 px-5">
                            <code className={`font-mono text-xs px-1.5 py-0.5 rounded ${accentMap[g.accent].bg} ${accentMap[g.accent].text}`}>{r.name}</code>
                          </td>
                          <td className="py-3 px-5 text-gray-700 dark:text-gray-300">{r.description}</td>
                          <td className="py-3 px-5 text-gray-500 dark:text-gray-500 font-mono text-xs">{r.default}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // examples
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Example commands
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-3">heavy chain</h3>
              <CodeBlock>{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \\
  --chain-type=heavy \\
  --sequences=/data/input/heavy_sequences.csv \\
  --save-path=/data/output/heavy_results \\
  --v-allele-threshold=0.75 \\
  --d-allele-threshold=0.3 \\
  --j-allele-threshold=0.8`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-3">light chain</h3>
              <CodeBlock>{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \\
  --chain-type=light \\
  --sequences=/data/input/light_sequences.csv \\
  --save-path=/data/output/light_results \\
  --airr-format \\
  --fix-orientation`}</CodeBlock>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // best practices
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Tips & best practices
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">// performance</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Performance</h3>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li>Use larger batch sizes for better GPU utilization</li>
                <li>Process sequences in batches of similar lengths</li>
                <li>Monitor memory usage with large datasets</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-2">// accuracy</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Accuracy</h3>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li>Use appropriate thresholds for your data quality</li>
                <li>Enable orientation fixing for mixed datasets</li>
                <li>Choose the correct chain type model</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">// output</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Output</h3>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li>Enable AIRR format for downstream analysis</li>
                <li>Save prediction objects for debugging</li>
                <li>Use meaningful output directory names</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next */}
        <div className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // next
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready for advanced usage?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-prose">
            Explore technical details, examples, and troubleshooting guides to get the most out of AlignAIR.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/docs/technical"
              className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Technical details
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/docs/examples"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
            >
              View examples
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
