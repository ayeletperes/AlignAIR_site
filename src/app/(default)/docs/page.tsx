export const metadata = {
  title: 'AlignAIR Docs',
  description: 'AlignAIR Documentation Hub',
}

import Link from 'next/link'

interface SectionCard {
  title: string;
  description: string;
  href: string;
  number: string;
  category: string;
}

const sections: SectionCard[] = [
  {
    number: '01',
    category: 'install',
    title: 'Installation',
    description: 'Get AlignAIR running with Docker or build from source. System requirements and troubleshooting.',
    href: '/docs/installation',
  },
  {
    number: '02',
    category: 'usage',
    title: 'Usage Guide',
    description: 'Run AlignAIR with different parameters, configure thresholds, and optimize for your datasets.',
    href: '/docs/usage',
  },
  {
    number: '03',
    category: 'examples',
    title: 'Examples',
    description: 'Real-world examples with sample data, commands, and expected outputs.',
    href: '/docs/examples',
  },
  {
    number: '04',
    category: 'technical',
    title: 'Technical Details',
    description: 'Algorithms, neural network architecture, training pipeline, and theoretical background.',
    href: '/docs/technical',
  },
  {
    number: '05',
    category: 'reference',
    title: 'API Reference',
    description: 'Complete parameter reference, input/output formats, and integration guides.',
    href: '/docs/api',
  },
  {
    number: '06',
    category: 'help',
    title: 'FAQ & Help',
    description: 'Common questions, troubleshooting guides, and community support.',
    href: '/docs/faq',
  },
  {
    number: '07',
    category: 'legal',
    title: 'Terms & License',
    description: 'Legal information, licensing terms, and usage rights.',
    href: '/docs/terms',
  },
];

const popular = [
  { n: '1', title: 'Docker Quick Start', body: 'Get AlignAIR running in minutes.', href: '/docs/installation' },
  { n: '2', title: 'Parameter Guide', body: 'Configure thresholds for your data.', href: '/docs/usage' },
  { n: '3', title: 'Model Architecture', body: 'Neural network design and training.', href: '/docs/technical/architecture' },
];

export default function DocsPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-20 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            AlignAIR Documentation
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Install, use, and understand AlignAIR. Pick a section below or start with the quickstart.
          </p>
        </div>

        {/* Quick start strip */}
        <div className="py-10 border-b border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                // quickstart
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                New to AlignAIR?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-prose">
                Up and running in under ten minutes. No complex setup required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs/installation"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  Quick install
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/docs/examples"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
                >
                  View examples
                </Link>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-950 p-4 font-mono text-xs">
              <div className="text-gray-500 mb-2 uppercase tracking-wider">$ install</div>
              <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{`docker pull thomask90/alignair:latest
docker run -it --rm \\
  -v ~/data:/data \\
  thomask90/alignair:latest`}</pre>
            </div>
          </div>
        </div>

        {/* Section grid */}
        <div className="py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group block bg-white dark:bg-black p-6 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
              >
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                  {s.number} / {s.category}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {s.description}
                </p>
                <div className="inline-flex items-center text-sm text-purple-700 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                  Open
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular */}
        <div className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // popular
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Popular pages
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {popular.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center font-mono text-xs text-gray-700 dark:text-gray-300 mr-3">
                    {p.n}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {p.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
            // community
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Get help and contribute
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-prose">
            Join the AlignAIR community on GitHub. Open an issue, start a discussion, or send a pull request.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/MuteJester/AlignAIR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://github.com/MuteJester/AlignAIR/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm transition-colors"
            >
              Discussions
            </a>
            <a
              href="https://github.com/MuteJester/AlignAIR/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm transition-colors"
            >
              Report an issue
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
