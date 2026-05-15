export const metadata = {
  title: 'Terms & License - AlignAIR Docs',
  description: 'Legal information, licensing, and terms of use for AlignAIR',
}

import Link from 'next/link'

export default function TermsPage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Terms &amp; License
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Legal information and licensing for AlignAIR.
          </p>
        </div>

        {/* Quick nav */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// jump to</div>
          <div className="grid sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {[
              { href: '#license', label: 'Software License', desc: 'AlignAIR project licensing' },
              { href: '#website-terms', label: 'Website Terms', desc: 'Documentation usage terms' },
              { href: '#data-usage', label: 'Data & Privacy', desc: 'How we handle your data' },
              { href: '#contact', label: 'Contact', desc: 'Legal inquiries' },
            ].map((l) => (
              <a key={l.href} href={l.href} className="block bg-white dark:bg-black p-4 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">{l.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{l.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright banner */}
        <div className="py-10 border-b border-gray-200 dark:border-gray-800">
          <div className="border border-gray-200 dark:border-gray-800 rounded-md p-6 bg-gray-50 dark:bg-gray-950">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// copyright</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">© 2025 AlignAIR Project</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              AlignAIR and its associated tools are developed for advancing computational biology research.
              All rights reserved except where explicitly noted.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/MuteJester/AlignAIR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                View source code
              </a>
              <Link
                href="/docs/faq"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                Need help?
              </Link>
            </div>
          </div>
        </div>

        {/* Software License */}
        <section id="license" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 01 / license</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Software license</h2>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              AlignAIR is released as open source software. The specific license terms can be found in the{' '}
              <a href="https://github.com/MuteJester/AlignAIR/blob/main/LICENSE" className="text-purple-700 dark:text-purple-400 underline underline-offset-2" target="_blank" rel="noopener noreferrer">LICENSE file</a> in the GitHub repository.
            </p>
            <div className="border-l-2 border-amber-300 dark:border-amber-800 pl-4 py-1 bg-amber-50/50 dark:bg-amber-900/10 rounded-r-md">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">// notice</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Please refer to the official GitHub repository for the most current licensing terms.
                Academic and commercial usage guidelines may vary.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden mt-6">
            <div className="bg-white dark:bg-black p-5">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Permitted uses</h4>
              <ul className="list-disc list-outside ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Academic research and education</li>
                <li>Personal projects and learning</li>
                <li>Contributing back to the project</li>
                <li>Creating derivative works (per license)</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
              <ul className="list-disc list-outside ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Maintain copyright notices</li>
                <li>Include license in distributions</li>
                <li>Cite the project in publications</li>
                <li>Follow contribution guidelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Website Terms */}
        <section id="website-terms" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 02 / website</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Website &amp; documentation terms</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            This documentation website and its content are provided for educational and informational purposes.
            By using this site, you agree to the following terms:
          </p>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            {[
              { title: 'Content license', body: 'Documentation content is available under Creative Commons licensing where applicable.' },
              { title: 'Code examples', body: 'Code examples follow the same license as the main AlignAIR project.' },
              { title: 'External links', body: 'Links to external sites are provided for convenience and are not under our control.' },
              { title: 'Accuracy', body: 'We strive for accuracy but make no warranties about the completeness of information.' },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-black p-5">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data & Privacy */}
        <section id="data-usage" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 03 / data &amp; privacy</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Data &amp; privacy</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-green-300 dark:border-green-800 pl-4 py-1 bg-green-50/50 dark:bg-green-900/10 rounded-r-md">
              <div className="text-xs font-mono uppercase tracking-widest text-green-700 dark:text-green-400 mb-1">// privacy first</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                AlignAIR processes your sequence data locally when using Docker. No data is transmitted to external servers without your explicit consent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
              <div className="bg-white dark:bg-black p-5">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Local processing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Docker containers run completely on your machine. Your sequence data never leaves your system.
                </p>
              </div>
              <div className="bg-white dark:bg-black p-5">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Web interface</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our web tool processes data in your browser. No data is stored on our servers.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-amber-300 dark:border-amber-800 pl-4 py-1 bg-amber-50/50 dark:bg-amber-900/10 rounded-r-md">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">// sensitive data</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                For sensitive or proprietary sequence data, we strongly recommend using the Docker installation rather than the web interface.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">// 04 / contact</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Legal contact</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            For legal inquiries, licensing questions, or to report intellectual property concerns, please contact us:
          </p>
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-white dark:bg-black p-5">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Direct contact</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For legal and licensing matters:</p>
              <a href="mailto:alignair@alignair.ai?subject=AlignAIR Legal Inquiry" className="text-sm text-purple-700 dark:text-purple-400 underline underline-offset-2">
                alignair@alignair.ai
              </a>
            </div>
            <div className="bg-white dark:bg-black p-5">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Issues &amp; support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For technical issues or bugs:</p>
              <a href="https://github.com/MuteJester/AlignAIR/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 dark:text-purple-400 underline underline-offset-2">
                GitHub Issues
              </a>
            </div>
          </div>
        </section>

        {/* Back */}
        <div className="py-12">
          <Link
            href="/docs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to documentation
          </Link>
        </div>

      </div>
    </section>
  )
}
