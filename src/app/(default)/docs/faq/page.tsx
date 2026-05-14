export const metadata = {
  title: 'FAQ & Troubleshooting | AlignAIR Docs',
  description: 'Frequently asked questions and troubleshooting guide for AlignAIR.',
}

interface FaqItem { q: string; a: React.ReactNode; }

const installFaqs: FaqItem[] = [
  {
    q: 'Which installation method should I choose?',
    a: (
      <>
        <strong className="text-gray-900 dark:text-white">Docker (recommended)</strong> for most users — easier and includes everything pre-configured.{' '}
        <strong className="text-gray-900 dark:text-white">Local installation</strong> only if you&apos;re a developer or need custom modifications.
      </>
    ),
  },
  {
    q: 'Do I need a GPU to run AlignAIR?',
    a: <>No, but it&apos;s <strong className="text-gray-900 dark:text-white">highly recommended</strong>. AlignAIR can run on CPU but will be significantly slower. For best performance, use an NVIDIA GPU with CUDA 11+ support.</>,
  },
  {
    q: 'The Docker image is very large. Is this normal?',
    a: <>Yes, the image includes PyTorch, CUDA libraries, and pre-trained models. Expect 3–5GB download size. This is normal for deep learning applications.</>,
  },
];

const usageFaqs: FaqItem[] = [
  {
    q: 'What input file formats are supported?',
    a: <>AlignAIR supports <strong className="text-gray-900 dark:text-white">CSV, TSV, and FASTA</strong> formats. For CSV/TSV files, ensure there&apos;s a column named <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">sequence</code> containing your nucleotide sequences.</>,
  },
  {
    q: 'How do I choose the right threshold values?',
    a: (
      <>
        Start with defaults: <strong className="text-gray-900 dark:text-white">V=0.75, D=0.3, J=0.8</strong>. For high-quality data, increase thresholds for more stringent calls. For noisy data, decrease slightly. See the{' '}
        <a href="/docs/technical/thresholding" className="text-purple-700 dark:text-purple-400 underline underline-offset-2">thresholding guide</a> for details.
      </>
    ),
  },
  {
    q: 'Should I use heavy or light chain models?',
    a: (
      <>
        <p className="mb-2">Choose based on your data:</p>
        <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
          <li><strong className="text-gray-900 dark:text-white">Heavy chain:</strong> Use <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">IGH_S5F_576</code> for IGH sequences</li>
          <li><strong className="text-gray-900 dark:text-white">Light chain:</strong> Use <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">IGL_S5F_576</code> for IGL/IGK sequences</li>
        </ul>
      </>
    ),
  },
  {
    q: 'My sequences are longer than 576 nucleotides. What happens?',
    a: <>AlignAIR automatically trims sequences to the maximum input size (default 576 nt) during preprocessing. Trimming preserves the most informative regions for V(D)J assignment.</>,
  },
];

const perfFaqs: FaqItem[] = [
  {
    q: 'How can I speed up processing?',
    a: (
      <>
        <p className="mb-2"><strong className="text-gray-900 dark:text-white">Performance tips:</strong></p>
        <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
          <li>Increase batch size: <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">--batch-size=4096</code></li>
          <li>Use GPU instead of CPU</li>
          <li>Process sequences in similar length groups</li>
          <li>Ensure sufficient GPU memory</li>
        </ul>
      </>
    ),
  },
  {
    q: 'AlignAIR is running out of memory. What can I do?',
    a: (
      <>
        <p className="mb-2"><strong className="text-gray-900 dark:text-white">Memory optimization:</strong></p>
        <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
          <li>Reduce batch size: <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">--batch-size=512</code></li>
          <li>Split large datasets into smaller files</li>
          <li>Close other GPU-intensive applications</li>
          <li>Use CPU mode for very large datasets</li>
        </ul>
      </>
    ),
  },
  {
    q: 'How long should processing take?',
    a: (
      <div className="space-y-2 text-sm font-mono">
        <div className="flex justify-between"><span>1K sequences (GPU)</span><span className="text-green-700 dark:text-green-400">~30 seconds</span></div>
        <div className="flex justify-between"><span>10K sequences (GPU)</span><span className="text-green-700 dark:text-green-400">~3–5 minutes</span></div>
        <div className="flex justify-between"><span>100K sequences (GPU)</span><span className="text-amber-700 dark:text-amber-400">~30–60 minutes</span></div>
        <div className="flex justify-between"><span>CPU processing</span><span className="text-red-700 dark:text-red-400">~10× slower</span></div>
      </div>
    ),
  },
];

function FaqSection({ category, title, items }: { category: string; title: string; items: FaqItem[] }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400">// {category}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-900">
        {items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors list-none">
              <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
              <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // faq
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            FAQ &amp; Troubleshooting
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Quick answers to common questions and solutions to potential issues.
          </p>
        </div>

        {/* Quick fixes */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // common issues
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Common issues &amp; quick fixes
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Docker won&apos;t start</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-red-300 dark:border-red-800 pl-3">
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">Cannot connect to Docker daemon</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Fix:</strong> Start Docker Desktop or run{' '}
                    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">sudo systemctl start docker</code>
                  </div>
                </div>
                <div className="border-l-2 border-red-300 dark:border-red-800 pl-3">
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">Permission denied</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Fix:</strong> Add user to docker group:{' '}
                    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">sudo usermod -aG docker $USER</code>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Out of memory</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-amber-300 dark:border-amber-800 pl-3">
                  <div className="font-mono text-xs text-amber-700 dark:text-amber-400 mb-1">CUDA out of memory</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Fix:</strong> Reduce batch size:{' '}
                    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">--batch-size=512</code>
                  </div>
                </div>
                <div className="border-l-2 border-amber-300 dark:border-amber-800 pl-3">
                  <div className="font-mono text-xs text-amber-700 dark:text-amber-400 mb-1">System memory exhausted</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Fix:</strong> Process smaller datasets or increase swap space.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ sections */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800 space-y-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
              // questions
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Frequently asked questions
            </h2>
          </div>
          <FaqSection category="installation" title="Installation" items={installFaqs} />
          <FaqSection category="usage" title="Usage" items={usageFaqs} />
          <FaqSection category="performance" title="Performance" items={perfFaqs} />
        </div>

        {/* Error reference */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // errors
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Common error messages
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">File &amp; path errors</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">FileNotFoundError: No such file or directory</div>
                  <div className="text-gray-700 dark:text-gray-300">Check your file paths and ensure volume mounting is correct.</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">KeyError: &apos;sequence&apos;</div>
                  <div className="text-gray-700 dark:text-gray-300">Your CSV file must have a column named &quot;sequence&quot;.</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">CUDA &amp; memory errors</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">CUDA out of memory</div>
                  <div className="text-gray-700 dark:text-gray-300">Reduce batch size or use CPU mode.</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-red-700 dark:text-red-400 mb-1">No CUDA-capable device detected</div>
                  <div className="text-gray-700 dark:text-gray-300">Install NVIDIA drivers or use CPU mode.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // help
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-prose">
            Can&apos;t find what you&apos;re looking for? Open an issue or start a discussion on GitHub.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/MuteJester/AlignAIR/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Report an issue
            </a>
            <a
              href="https://github.com/MuteJester/AlignAIR/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
            >
              Join discussion
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
