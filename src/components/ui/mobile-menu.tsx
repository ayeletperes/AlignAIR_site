'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from './theme-provider'

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false)
  const mobileNav = useRef<HTMLButtonElement>(null)
  const context = useTheme();
  const theme = context?.theme || 'dark';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !mobileNavOpen || !target || mobileNav.current.contains(target as Node)) return
      setMobileNavOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // Close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return
      setMobileNavOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div className="flex lg:hidden">
      {/* Hamburger button */}
      <button
        ref={mobileNav}
        className={`hamburger relative p-2 rounded-lg transition-all duration-200 ${
          mobileNavOpen 
            ? 'bg-purple-100 dark:bg-purple-900/30' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-700 dark:text-gray-300"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" />
          <rect y="11" width="24" height="2" rx="1" />
          <rect y="18" width="24" height="2" rx="1" />
        </svg>
      </button>

      {/* Mobile navigation overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* Mobile navigation */}
      <nav
        id="mobile-nav"
        className={`fixed top-16 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] transform transition-all duration-300 ease-out ${
          mobileNavOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Navigation Links */}
          <div className="p-6">
            <div className="space-y-2">
              <Link
                href="/about"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 rounded-lg mr-3 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">About</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Learn about AlignAIR</div>
                </div>
              </Link>

              <Link
                href="/docs"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 rounded-lg mr-3 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Documentation</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Complete guides & API</div>
                </div>
              </Link>

              <Link
                href="/models"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 rounded-lg mr-3 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Models</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available AI models</div>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Tools Section */}

            <div className="space-y-2">
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tools</h3>
              </div>

              <Link
                href="/alignair"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">AlignAIR Web</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Browser interface</div>
                </div>
              </Link>

              <Link
                href="/cli"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">CLI Tool</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Command line</div>
                </div>
              </Link>

              <Link
                href="/yaml"
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">YAML Generator</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Config generator</div>
                </div>
              </Link>
            </div>

            
            <Link
              href="/tools/allele-query"
              className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
              onClick={() => setMobileNavOpen(false)}
            >
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg mr-3">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center">
                <div>
                  <div className="font-semibold">Allele Query</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Search allele database</div>
                </div>
                <span className="ml-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">DEV</span>
              </div>
            </Link>

            <Link
              href="/tools/v-gene-alignment"
              className="flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
              onClick={() => setMobileNavOpen(false)}
            >
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg mr-3">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center">
                <div>
                  <div className="font-semibold">V Gene Alignment Viewer</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">View V gene alignments</div>
                </div>
                <span className="ml-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">DEV</span>
              </div>
            </Link>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                href="https://github.com/MuteJester/AlignAIR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setMobileNavOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Link>
              
              <Link
                href="/alignair"
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                onClick={() => setMobileNavOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try AlignAIR
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
