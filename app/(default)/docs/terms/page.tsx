export const metadata = {
  title: 'Terms & License - AlignAIR Docs',
  description: 'Legal information, licensing, and terms of use for AlignAIR',
}

import Link from 'next/link'

export default function TermsPage() {
  return (
    <section>
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Terms & License</h1>
              <p className="text-gray-400">Legal information and licensing for AlignAIR</p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-900 rounded-xl p-6 mb-12 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="#license" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="font-medium text-white">Software License</div>
              <div className="text-sm text-gray-400">AlignAIR project licensing</div>
            </a>
            <a href="#website-terms" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="font-medium text-white">Website Terms</div>
              <div className="text-sm text-gray-400">Documentation usage terms</div>
            </a>
            <a href="#data-usage" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="font-medium text-white">Data & Privacy</div>
              <div className="text-sm text-gray-400">How we handle your data</div>
            </a>
            <a href="#contact" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="font-medium text-white">Contact</div>
              <div className="text-sm text-gray-400">Legal inquiries</div>
            </a>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 mb-12 border border-blue-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">© 2025 AlignAIR Project</h2>
            <p className="text-blue-200 mb-6 leading-relaxed">
              AlignAIR and its associated tools are developed for advancing computational biology research.
              All rights reserved except where explicitly noted.
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://github.com/MuteJester/AlignAIR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Source Code
              </a>
              <Link 
                href="/docs/faq" 
                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Need Help?
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">

          {/* Software License */}
          <section id="license" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Software License
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">AlignAIR Open Source License</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                AlignAIR is released as open source software. The specific license terms can be found in the 
                <a href="https://github.com/MuteJester/AlignAIR/blob/main/LICENSE" className="text-blue-400 hover:text-blue-300 ml-1 mr-1" target="_blank" rel="noopener noreferrer">
                  LICENSE file
                </a>
                in the GitHub repository.
              </p>
              
              <div className="bg-black rounded-lg p-4 border border-gray-600">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-yellow-200 font-medium mb-1">License Notice</p>
                    <p className="text-gray-300 text-sm">
                      Please refer to the official GitHub repository for the most current licensing terms. 
                      Academic and commercial usage guidelines may vary.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">✅ Permitted Uses</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Academic research and education</li>
                  <li>• Personal projects and learning</li>
                  <li>• Contributing back to the project</li>
                  <li>• Creating derivative works (per license)</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">📋 Requirements</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Maintain copyright notices</li>
                  <li>• Include license in distributions</li>
                  <li>• Cite the project in publications</li>
                  <li>• Follow contribution guidelines</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Website Terms */}
          <section id="website-terms" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Website & Documentation Terms
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Documentation Usage</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  This documentation website and its content are provided for educational and informational purposes. 
                  By using this site, you agree to the following terms:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Content License</h4>
                    <p className="text-sm text-gray-400">
                      Documentation content is available under Creative Commons licensing where applicable.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Code Examples</h4>
                    <p className="text-sm text-gray-400">
                      Code examples follow the same license as the main AlignAIR project.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">External Links</h4>
                    <p className="text-sm text-gray-400">
                      Links to external sites are provided for convenience and are not under our control.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Accuracy</h4>
                    <p className="text-sm text-gray-400">
                      We strive for accuracy but make no warranties about the completeness of information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data & Privacy */}
          <section id="data-usage" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Data & Privacy
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Data Handling Practices</h3>
              
              <div className="space-y-6">
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                  <h4 className="font-semibold text-green-300 mb-2">🔒 Privacy First</h4>
                  <p className="text-gray-300 text-sm">
                    AlignAIR processes your sequence data locally when using Docker. No data is transmitted to external servers 
                    without your explicit consent.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Local Processing</h4>
                    <p className="text-gray-400 text-sm">
                      Docker containers run completely on your machine. Your sequence data never leaves your system.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Web Interface</h4>
                    <p className="text-gray-400 text-sm">
                      Our web tool processes data server-side for demonstration purposes only. No data is stored permanently.
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700">
                  <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Sensitive Data Notice</h4>
                  <p className="text-gray-300 text-sm">
                    For sensitive or proprietary sequence data, we strongly recommend using the Docker installation 
                    rather than the web interface.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Legal Contact
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-300 mb-6">
                For legal inquiries, licensing questions, or to report intellectual property concerns, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">📧 Direct Contact</h4>
                  <p className="text-gray-400 text-sm mb-2">For legal and licensing matters:</p>
                  <a 
                    href="mailto:alignair@alignair.ai?subject=AlignAIR Legal Inquiry" 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    alignair@alignair.ai
                  </a>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">🐛 Issues & Support</h4>
                  <p className="text-gray-400 text-sm mb-2">For technical issues or bugs:</p>
                  <a 
                    href="https://github.com/MuteJester/AlignAIR/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    GitHub Issues
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
        
        {/* Back to top */}
        <div className="text-center mt-12">
          <Link 
            href="/docs" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Documentation
          </Link>
        </div>

      </div>
    </section>
  )
} 