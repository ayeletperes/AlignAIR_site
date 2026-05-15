export const metadata = {
  title: 'Thresholding Logic | AlignAIR Docs',
  description: 'Details of the likelihood thresholding logic used in AlignAIR.',
};

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-purple-700 dark:text-purple-300">{children}</code>;
}

const steps = [
  { n: '1', title: 'Input likelihood vector', body: <>For each segment (V, D, J), let the output vector be <Code>p = [p₁, …, pₙ]</Code>.</> },
  { n: '2', title: 'Find maximum', body: <>Compute the maximum likelihood: <Code>p_max = max(p)</Code>.</> },
  { n: '3', title: 'Calculate threshold', body: <>Define threshold: <Code>threshold = Φ × p_max</Code>.</> },
  { n: '4', title: 'Filter alleles', body: <>Keep all <Code>pᵢ</Code> such that <Code>pᵢ ≥ threshold</Code>.</> },
  { n: '5', title: 'Apply cap', body: <>If results exceed the cap, keep only the top-scoring alleles.</> },
];

const segments = [
  { label: 'V', threshold: '0.75', cap: '3', accent: 'text-blue-700 dark:text-blue-400', note: 'High threshold due to V region length and conservation.' },
  { label: 'D', threshold: '0.30', cap: '3', accent: 'text-amber-700 dark:text-amber-400', note: 'Lower threshold due to D region’s short length and high mutation.' },
  { label: 'J', threshold: '0.80', cap: '3', accent: 'text-green-700 dark:text-green-400', note: 'High threshold due to J region’s conserved nature.' },
];

export default function ThresholdingPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // technical / thresholding
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Thresholding Logic
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            AlignAIR uses a dynamic thresholding strategy to convert model likelihood outputs into final allele calls.
            This post-processing step ensures robustness while maintaining alignment accuracy.
          </p>
        </div>

        {/* Overview */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 01 / overview</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The AlignAIR model outputs a likelihood vector for each of the V, D, and J gene segments. Each vector contains probabilities corresponding to each possible allele in the reference set. To determine the final predicted alleles, AlignAIR applies a <strong className="text-gray-900 dark:text-white">Maximum Likelihood Thresholding</strong> method followed by a <strong className="text-gray-900 dark:text-white">cap enforcement</strong> procedure.
          </p>
        </section>

        {/* Algorithm */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 02 / algorithm</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Thresholding algorithm</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-3">steps</h3>
              <div className="space-y-3">
                {steps.map((s) => (
                  <div key={s.n} className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-7 h-7 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center font-mono text-xs text-gray-700 dark:text-gray-300 mr-3">
                        {s.n}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</h4>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-10">{s.body}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-3">example · V allele selection</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-5 space-y-4 font-mono text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Input likelihood vector</div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">IGHV1-2*01</span><span className="text-blue-700 dark:text-blue-400">0.92</span></div>
                    <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">IGHV1-3*01</span><span className="text-blue-700 dark:text-blue-400">0.78</span></div>
                    <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">IGHV1-4*01</span><span className="text-gray-500">0.45</span></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">p_max × Φ (0.75)</div>
                  <div className="text-purple-700 dark:text-purple-400">threshold = 0.92 × 0.75 = 0.69</div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Kept (≥ 0.69)</div>
                  <div className="text-green-700 dark:text-green-400">IGHV1-2*01, IGHV1-3*01</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Defaults */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 03 / defaults</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Default threshold parameters</h2>
          <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {segments.map((s) => (
              <div key={s.label} className="bg-white dark:bg-black p-5">
                <div className="flex items-center mb-4">
                  <div className={`w-9 h-9 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center text-lg font-semibold mr-3 ${s.accent}`}>
                    {s.label}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{s.label} segment</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-mono uppercase text-xs tracking-wider">threshold (Φ)</span>
                    <span className={`font-mono font-semibold ${s.accent}`}>{s.threshold}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-mono uppercase text-xs tracking-wider">default cap</span>
                    <span className={`font-mono font-semibold ${s.accent}`}>{s.cap}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Short-D */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 04 / short-d</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Special case: Short-D handling</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-prose">
            Due to the short and highly mutated nature of D segments, an additional label called <Code>Short-D</Code> is added to the likelihood vector.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-5">
              <h3 className="text-sm font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">logic</h3>
              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  <div className="font-semibold text-gray-900 dark:text-white">1. Detection</div>
                  <div>If Short-D probability &gt; 0.5</div>
                </li>
                <li>
                  <div className="font-semibold text-gray-900 dark:text-white">2. Suppression</div>
                  <div>Apply penalty to other D allele predictions</div>
                </li>
                <li>
                  <div className="font-semibold text-gray-900 dark:text-white">3. Consistency</div>
                  <div>Ensures alignment between segmentation and classification</div>
                </li>
              </ol>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-5 font-mono text-sm">
              <h3 className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">example scenario</h3>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Before check</div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">IGHD1-1*01</span><span className="text-blue-700 dark:text-blue-400">0.45</span></div>
                  <div className="flex justify-between"><span className="text-gray-700 dark:text-gray-300">IGHD2-2*01</span><span className="text-green-700 dark:text-green-400">0.38</span></div>
                  <div className="flex justify-between"><span className="text-amber-700 dark:text-amber-400">Short-D</span><span className="text-amber-700 dark:text-amber-400">0.65</span></div>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">After suppression</div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-red-700 dark:text-red-400">IGHD1-1*01</span><span className="text-red-700 dark:text-red-400">suppressed</span></div>
                  <div className="flex justify-between"><span className="text-red-700 dark:text-red-400">IGHD2-2*01</span><span className="text-red-700 dark:text-red-400">suppressed</span></div>
                  <div className="flex justify-between"><span className="text-amber-700 dark:text-amber-400">Result</span><span className="text-amber-700 dark:text-amber-400">no D call</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intuition + Optimization */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-6">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">// intuition</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why this works</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                This method captures the probabilistic nature of the model&apos;s predictions while maintaining a clear cutoff to reduce noise.
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li>Retains all plausible candidates above threshold</li>
                <li>Avoids arbitrary top-k selection</li>
                <li>Balances sensitivity and specificity</li>
              </ul>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-6">
              <div className="text-xs font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-2">// optimization</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Optimization strategy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The optimal values of Φ and cap were selected via grid search to maximize agreement with ground truth labels.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Sensitivity', pct: 83, color: 'bg-green-600 dark:bg-green-400' },
                  { label: 'Specificity', pct: 80, color: 'bg-blue-600 dark:bg-blue-400' },
                  { label: 'Efficiency', pct: 75, color: 'bg-purple-600 dark:bg-purple-400' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{m.label}</span>
                      <span className="font-mono text-gray-500">{m.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                      <div className={`${m.color} h-1.5 rounded-full`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// references</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">References</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
            See supplementary section 1.5.2 in the AlignAIR manuscript for full implementation details and performance analysis.
          </p>
        </section>

      </div>
    </section>
  );
}
