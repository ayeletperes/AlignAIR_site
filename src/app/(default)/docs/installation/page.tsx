export const metadata = {
  title: 'Installation | AlignAIR Docs',
  description: 'How to install and run AlignAIR using Docker or local installation.',
}

import Link from 'next/link';

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950 p-4 font-mono text-xs overflow-x-auto">
      <pre className="text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed">{children}</pre>
    </div>
  );
}

const dockerSteps = [
  { n: '1', title: 'Verify Docker', body: 'Make sure Docker is installed and running.', cmd: 'docker --version', hint: 'Expected: Docker version 20.10+' },
  { n: '2', title: 'Pull AlignAIR Image', body: 'Download the latest AlignAIR image.', cmd: 'docker pull thomask90/alignair:latest', hint: 'May take a few minutes.' },
  { n: '3', title: 'Prepare Data Directory', body: 'Create directories for your data.', cmd: 'mkdir -p ~/alignair-data/input ~/alignair-data/output', hint: 'Place input files in ~/alignair-data/input/' },
  { n: '4', title: 'Run Container', body: 'Start AlignAIR with volume mounting.', cmd: 'docker run -it --rm -v ~/alignair-data:/data thomask90/alignair:latest', hint: 'You should see the AlignAIR command prompt.' },
];

const reqRecommended = [
  { label: 'NVIDIA GPU', body: 'CUDA 11+ for optimal performance' },
  { label: '16GB+ RAM', body: 'For large batch processing' },
  { label: '10GB+ Storage', body: 'For models and datasets' },
];

const reqMinimum = [
  { label: 'Multi-core CPU', body: 'CPU mode available (slower)' },
  { label: '8GB+ RAM', body: 'For basic processing' },
  { label: '5GB+ Storage', body: 'Minimum free space' },
];

export default function InstallationPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // installation
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Installation Guide
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Get AlignAIR up and running in minutes. Docker is recommended; local installation is also supported for developers.
          </p>
        </div>

        {/* Method overview */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // methods
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Choose your installation method
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Docker</h3>
                <span className="text-xs font-mono uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Recommended</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                The easiest way to run AlignAIR. Everything is pre-configured and ready to use.
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 list-disc list-outside ml-5">
                <li>No manual setup required</li>
                <li>Consistent environment across platforms</li>
                <li>Pre-trained models included</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Local</h3>
                <span className="text-xs font-mono uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">Advanced</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Install AlignAIR directly. Recommended for developers and advanced users.
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 list-disc list-outside ml-5">
                <li>Full control over environment</li>
                <li>Easier integration with workflows</li>
                <li>Requires manual configuration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Docker steps */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // docker
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Docker installation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dockerSteps.map((s) => (
              <div key={s.n} className="border border-gray-200 dark:border-gray-800 rounded-md p-5">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center font-mono text-xs text-gray-700 dark:text-gray-300 mr-3">
                    {s.n}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{s.body}</p>
                <CodeBlock>{s.cmd}</CodeBlock>
                <div className="mt-2 text-xs font-mono text-gray-500">{s.hint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System requirements */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // requirements
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            System requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-6">
              <div className="text-xs font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-3">
                // recommended
              </div>
              <ul className="space-y-3">
                {reqRecommended.map((r) => (
                  <li key={r.label}>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{r.body}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-6">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">
                // minimum
              </div>
              <ul className="space-y-3">
                {reqMinimum.map((r) => (
                  <li key={r.label}>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{r.body}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Local install */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // local
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Local installation (advanced)
          </h2>
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Python 3.8+</div>
                  <CodeBlock>python --version</CodeBlock>
                </div>
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Git</div>
                  <CodeBlock>git --version</CodeBlock>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Installation steps</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">1. Clone the repository:</div>
                  <CodeBlock>git clone https://github.com/MuteJester/AlignAIR.git</CodeBlock>
                </div>
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">2. Navigate to directory and install dependencies:</div>
                  <CodeBlock>{`cd AlignAIR
pip install -r requirements.txt`}</CodeBlock>
                </div>
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">3. Verify installation:</div>
                  <CodeBlock>python app.py --help</CodeBlock>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">// note</div>
              <p className="text-sm text-amber-900 dark:text-amber-200">
                This method requires a properly configured Python environment and is recommended for developers only.
                You&apos;ll need to manually download model weights and configure paths.
              </p>
            </div>
          </div>
        </div>

        {/* Next */}
        <div className="py-12">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // next
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            What&apos;s next?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-prose">
            AlignAIR is ready to process your sequence data. Check the usage guide to run your first analysis.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/docs/usage" className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">// usage</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Usage Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">How to run AlignAIR with different parameters.</p>
            </Link>
            <Link href="/docs/technical" className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">// technical</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Technical Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Architecture and algorithms behind AlignAIR.</p>
            </Link>
            <a href="https://github.com/MuteJester/AlignAIR" target="_blank" rel="noopener noreferrer" className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">// github</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Repository</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Source code, issues, and contributions.</p>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
