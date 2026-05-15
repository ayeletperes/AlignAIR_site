export const metadata = {
  title: 'API Reference | AlignAIR Docs',
  description: 'Complete API reference for AlignAIR parameters, input formats, and output schemas.',
}

import Link from 'next/link'

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{children}</code>;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950 p-4 font-mono text-xs overflow-x-auto">
      <pre className="text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed">{children}</pre>
    </div>
  );
}

const requiredParams = [
  { name: '--model-checkpoint', type: 'string', desc: 'Path to trained model weights', ex: '/app/pretrained_models/IGH_S5F_576' },
  { name: '--chain-type', type: 'choice', desc: 'heavy | light', ex: 'heavy' },
  { name: '--sequences', type: 'string', desc: 'Path to input sequence file', ex: '/data/input/sequences.csv' },
  { name: '--save-path', type: 'string', desc: 'Output directory path', ex: '/data/output' },
];

const optModel = [
  { name: '--max-input-size', type: 'int (default: 576)', desc: 'Maximum sequence length' },
  { name: '--batch-size', type: 'int (default: 2048)', desc: 'Processing batch size' },
];

const optThreshold = [
  { name: '--v-allele-threshold', type: 'float (default: 0.75)', desc: 'V gene threshold' },
  { name: '--d-allele-threshold', type: 'float (default: 0.3)', desc: 'D gene threshold' },
  { name: '--j-allele-threshold', type: 'float (default: 0.8)', desc: 'J gene threshold' },
  { name: '--v-cap / --d-cap / --j-cap', type: 'int (default: 3)', desc: 'Maximum calls per gene' },
];

const optProcessing = [
  { name: '--airr-format', type: 'flag', desc: 'Output full AIRR schema' },
  { name: '--fix-orientation', type: 'flag', desc: 'Auto-correct sequence orientation' },
  { name: '--translate-to-asc', type: 'flag', desc: 'Use ASC allele names' },
  { name: '--save-predict-object', type: 'flag', desc: 'Save raw predictions for debugging' },
];

const standardOutput = [
  { col: 'sequence_id', type: 'string', desc: 'Unique sequence identifier', ex: 'seq_001' },
  { col: 'v_call', type: 'string', desc: 'V gene assignment(s)', ex: 'IGHV1-2*01' },
  { col: 'd_call', type: 'string', desc: 'D gene assignment(s)', ex: 'IGHD3-3*01' },
  { col: 'j_call', type: 'string', desc: 'J gene assignment(s)', ex: 'IGHJ4*01' },
  { col: 'productive', type: 'boolean', desc: 'Sequence productivity status', ex: 'True' },
  { col: 'sequence', type: 'string', desc: 'Input sequence (preserved)', ex: 'CAGGTG…' },
];

export default function APIReferencePage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // api reference
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            API Reference
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Complete reference for AlignAIR command-line interface, parameters, input formats, and output schemas.
          </p>
        </div>

        {/* Jump nav */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// jump to</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {[
              { href: '#cli', label: 'CLI Interface' },
              { href: '#parameters', label: 'Parameters' },
              { href: '#input-formats', label: 'Input Formats' },
              { href: '#output-schema', label: 'Output Schema' },
            ].map((l) => (
              <a key={l.href} href={l.href} className="block bg-white dark:bg-black p-4 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors text-sm font-medium text-gray-900 dark:text-white">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* CLI */}
        <section id="cli" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 01 / cli</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Command Line Interface</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">basic syntax</h3>
              <CodeBlock>python app.py [COMMAND] [OPTIONS]</CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">available commands</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md divide-y divide-gray-100 dark:divide-gray-900">
                <div className="px-4 py-3 flex items-center justify-between">
                  <Code>run</Code>
                  <div className="flex-1 mx-4 text-sm text-gray-700 dark:text-gray-300">Execute AlignAIR sequence analysis with specified parameters.</div>
                  <span className="text-xs font-mono uppercase tracking-widest bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">primary</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <Code>--help</Code>
                  <div className="flex-1 mx-4 text-sm text-gray-700 dark:text-gray-300">Display help information and parameter list.</div>
                  <span className="text-xs font-mono uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">utility</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <Code>--version</Code>
                  <div className="flex-1 mx-4 text-sm text-gray-700 dark:text-gray-300">Show AlignAIR version information.</div>
                  <span className="text-xs font-mono uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">utility</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">exit codes</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                {[
                  { code: '0', label: 'Success', accent: 'text-green-700 dark:text-green-400' },
                  { code: '1', label: 'General error', accent: 'text-red-700 dark:text-red-400' },
                  { code: '2', label: 'Invalid arguments', accent: 'text-amber-700 dark:text-amber-400' },
                  { code: '3', label: 'File not found', accent: 'text-amber-700 dark:text-amber-400' },
                ].map((e) => (
                  <div key={e.code} className="bg-white dark:bg-black p-4 flex items-center justify-between">
                    <code className={`font-mono text-lg ${e.accent}`}>{e.code}</code>
                    <span className={`text-sm ${e.accent}`}>{e.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Parameters */}
        <section id="parameters" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 02 / parameters</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Complete parameters reference</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-red-700 dark:text-red-400 mb-3">required</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Parameter</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Type</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Description</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredParams.map((p) => (
                        <tr key={p.name} className="border-b border-gray-100 dark:border-gray-900 last:border-b-0">
                          <td className="py-3 px-4"><Code>{p.name}</Code></td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{p.type}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{p.desc}</td>
                          <td className="py-3 px-4"><code className="text-xs text-green-700 dark:text-green-400 font-mono">{p.ex}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {[
              { label: 'model configuration', accent: 'text-blue-700 dark:text-blue-400', rows: optModel },
              { label: 'threshold settings', accent: 'text-purple-700 dark:text-purple-400', rows: optThreshold },
              { label: 'processing options', accent: 'text-amber-700 dark:text-amber-400', rows: optProcessing },
            ].map((group) => (
              <div key={group.label}>
                <h3 className={`text-sm font-mono uppercase tracking-widest ${group.accent} mb-3`}>{group.label}</h3>
                <div className="border border-gray-200 dark:border-gray-800 rounded-md divide-y divide-gray-100 dark:divide-gray-900">
                  {group.rows.map((r) => (
                    <div key={r.name} className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div><Code>{r.name}</Code></div>
                      <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">{r.type}</div>
                      <div className="text-gray-700 dark:text-gray-300">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Input formats */}
        <section id="input-formats" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 03 / input formats</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Input formats</h2>

          <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">CSV</h3>
              <p className="text-xs text-gray-500 mb-2">Required column: <Code>sequence</Code></p>
              <CodeBlock>{`sequence_id,sequence
seq_001,CAGGTGCAGCTG…
seq_002,GAGGTGCAGCTG…`}</CodeBlock>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">TSV</h3>
              <p className="text-xs text-gray-500 mb-2">Tab-separated values</p>
              <CodeBlock>{`sequence_id\tsequence
seq_001\tCAGGTGCAGCTG…
seq_002\tGAGGTGCAGCTG…`}</CodeBlock>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">FASTA</h3>
              <p className="text-xs text-gray-500 mb-2">Standard <Code>&gt;header</Code> format</p>
              <CodeBlock>{`>seq_001
CAGGTGCAGCTGGTGGAG…
>seq_002
GAGGTGCAGCTGGTGGAG…`}</CodeBlock>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-3">// valid sequences</h3>
              <ul className="list-disc list-outside ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>DNA nucleotides: A, T, G, C</li>
                <li>IUPAC ambiguous codes: N, R, Y, etc.</li>
                <li>Minimum length: 50 nucleotides</li>
                <li>Maximum length: auto-trimmed to max-input-size</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-mono uppercase tracking-widest text-red-700 dark:text-red-400 mb-3">// invalid sequences</h3>
              <ul className="list-disc list-outside ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Protein sequences (amino acids)</li>
                <li>Empty or whitespace-only sequences</li>
                <li>Sequences with invalid characters</li>
                <li>Extremely short sequences (&lt; 50 nt)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Output */}
        <section id="output-schema" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 04 / output schema</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Output schema</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">standard columns</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Column</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Type</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Description</th>
                        <th className="text-left py-3 px-4 font-mono uppercase text-xs tracking-wider text-gray-900 dark:text-white">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standardOutput.map((r) => (
                        <tr key={r.col} className="border-b border-gray-100 dark:border-gray-900 last:border-b-0">
                          <td className="py-3 px-4"><code className="font-mono text-xs text-amber-700 dark:text-amber-400">{r.col}</code></td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{r.type}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{r.desc}</td>
                          <td className="py-3 px-4"><code className="text-xs text-green-700 dark:text-green-400 font-mono">{r.ex}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-3">AIRR schema (--airr-format)</h3>
              <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                <div className="bg-white dark:bg-black p-5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Additional columns</h4>
                  <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <li><Code>sequence_alignment</Code> — Aligned sequence</li>
                    <li><Code>germline_alignment</Code> — Germline reference</li>
                    <li><Code>v_sequence_start</Code> / <Code>v_sequence_end</Code></li>
                    <li><Code>d_sequence_start</Code> / <Code>d_sequence_end</Code></li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-black p-5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Standardized fields</h4>
                  <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <li><Code>j_sequence_start</Code> / <Code>j_sequence_end</Code></li>
                    <li><Code>cdr3</Code> / <Code>cdr3_aa</Code></li>
                    <li><Code>mutation_count</Code></li>
                    <li><Code>sequence_length</Code></li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">data types &amp; formats</h3>
              <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                <div className="bg-white dark:bg-black p-5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Gene calls</h4>
                  <div className="space-y-2 text-sm">
                    <div><div className="text-xs text-gray-500 mb-1">Single:</div><code className="font-mono text-xs text-purple-700 dark:text-purple-400">IGHV1-2*01</code></div>
                    <div><div className="text-xs text-gray-500 mb-1">Multiple:</div><code className="font-mono text-xs text-purple-700 dark:text-purple-400">IGHV1-2*01,IGHV1-3*01</code></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-black p-5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Coordinates</h4>
                  <div className="text-xs text-gray-500 mb-1">1-indexed positions:</div>
                  <code className="font-mono text-xs text-purple-700 dark:text-purple-400">v_start: 1, v_end: 285</code>
                </div>
                <div className="bg-white dark:bg-black p-5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Sequences</h4>
                  <div className="text-xs text-gray-500 mb-1">Uppercase nucleotides:</div>
                  <code className="font-mono text-xs text-purple-700 dark:text-purple-400">CAGGTGCAGCTG…</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick reference */}
        <div className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// quick reference</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Quick reference card</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Minimal command</h3>
              <code className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">python app.py run --model-checkpoint=… --chain-type=… --sequences=… --save-path=…</code>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">High stringency</h3>
              <code className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">--v-allele-threshold=0.9 --j-allele-threshold=0.9 --v-cap=1 --j-cap=1</code>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Large datasets</h3>
              <code className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">--batch-size=4096 --fix-orientation</code>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Full output</h3>
              <code className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">--airr-format --save-predict-object</code>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/docs/examples" className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
              View more examples
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
