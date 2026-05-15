export const metadata = {
  title: 'Examples Gallery | AlignAIR Docs',
  description: 'Examples and use cases for AlignAIR sequence analysis.',
}

import Link from 'next/link'

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div>
      {label && <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1.5">{label}</div>}
      <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950 p-4 font-mono text-xs overflow-x-auto">
        <pre className="text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed">{children}</pre>
      </div>
    </div>
  );
}

export default function ExamplesPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // examples
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Examples Gallery
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Real-world examples of AlignAIR in action — input sequences, commands, and expected outputs for different use cases.
          </p>
        </div>

        {/* Categories */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// categories</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {[
              { n: '01', cat: 'basic', title: 'Basic analysis', body: 'Single sequence processing' },
              { n: '02', cat: 'batch', title: 'Batch processing', body: 'Large dataset analysis' },
              { n: '03', cat: 'custom', title: 'Custom parameters', body: 'Optimized configurations' },
              { n: '04', cat: 'advanced', title: 'Advanced', body: 'Complex workflows' },
            ].map((c) => (
              <div key={c.n} className="bg-white dark:bg-black p-5">
                <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">
                  {c.n} / {c.cat}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example 1 */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// example 01</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Basic heavy chain analysis</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Single sequence V(D)J assignment with default parameters.</p>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CodeBlock label="input · sequences.csv">{`sequence_id,sequence
seq_001,CAGGTGCAGCTGGTGGAGTCTGGG...
seq_002,GAGGTGCAGCTGGTGGAGTCTGGG...`}</CodeBlock>
              <CodeBlock label="command">{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \\
  --chain-type=heavy \\
  --sequences=/data/input/sequences.csv \\
  --save-path=/data/output/results`}</CodeBlock>
            </div>
            <div className="space-y-4">
              <CodeBlock label="output · results.csv">{`sequence_id,v_call,d_call,j_call,productive
seq_001,IGHV1-2*01,IGHD3-3*01,IGHJ4*01,True
seq_002,IGHV1-3*01,IGHD2-2*01,IGHJ6*01,True`}</CodeBlock>
              <div className="border-l-2 border-blue-300 dark:border-blue-800 pl-4 py-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-md">
                <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-1">// processing</div>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                  <li>2 sequences processed</li>
                  <li>Default thresholds (V:0.75, D:0.3, J:0.8)</li>
                  <li>Both sequences are productive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example 2 */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// example 02</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Light chain with custom thresholds</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">High-stringency analysis for clean data.</p>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// use case</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  High-quality light chain sequences from flow-sorted B cells. Stricter thresholds for precise allele calling.
                </p>
              </div>
              <CodeBlock label="command">{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \\
  --chain-type=light \\
  --sequences=/data/input/light_chains.csv \\
  --save-path=/data/output/light_results \\
  --v-allele-threshold=0.9 \\
  --j-allele-threshold=0.85 \\
  --airr-format`}</CodeBlock>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// threshold impact</div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">V calls — default (0.75)</span><span className="text-amber-700 dark:text-amber-400">1,850</span></div>
                  <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">V calls — strict (0.9)</span><span className="text-green-700 dark:text-green-400">1,650</span></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Higher confidence, fewer ambiguous calls.</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// output format</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Full AIRR Schema with standardized column names for downstream analysis pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3 */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// example 03</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Large dataset processing</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Optimized parameters for 100K+ sequences.</p>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CodeBlock label="command">{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \\
  --chain-type=heavy \\
  --sequences=/data/input/large_dataset.csv \\
  --save-path=/data/output/batch_results \\
  --batch-size=4096 \\
  --fix-orientation`}</CodeBlock>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// performance tips</div>
                <ul className="list-disc list-outside ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Increased batch size to 4096</li>
                  <li>Enabled orientation fixing</li>
                  <li>GPU memory: 16GB+</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// processing times</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">100K sequences</span>
                      <span className="font-mono text-purple-700 dark:text-purple-400">45 minutes</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">500K sequences</span>
                      <span className="font-mono text-purple-700 dark:text-purple-400">3.5 hours</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// resource usage</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-2xl font-semibold text-purple-700 dark:text-purple-400">12GB</div>
                    <div className="text-xs text-gray-500">GPU memory</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-purple-700 dark:text-purple-400">95%</div>
                    <div className="text-xs text-gray-500">GPU utilization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// templates</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Quick start templates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-3">standard heavy chain</h3>
              <CodeBlock>{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGH_S5F_576 \\
  --chain-type=heavy \\
  --sequences=/data/input/sequences.csv \\
  --save-path=/data/output`}</CodeBlock>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-3">high-quality light chain</h3>
              <CodeBlock>{`python app.py run \\
  --model-checkpoint=/app/pretrained_models/IGL_S5F_576 \\
  --chain-type=light \\
  --sequences=/data/input/light_chains.csv \\
  --save-path=/data/output \\
  --v-allele-threshold=0.85 \\
  --j-allele-threshold=0.9 \\
  --airr-format`}</CodeBlock>
            </div>
          </div>
        </div>

        {/* Next */}
        <div className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// next</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to try these?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-prose">
            Use these examples as starting points for your own analyses. Modify parameters based on your specific data and requirements.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs/installation" className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
              Get started
            </Link>
            <Link href="/docs/usage" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors">
              Parameter guide
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
