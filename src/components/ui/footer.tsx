'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from './theme-provider';
import LogoBW from '../../../public/images/logo_alignair12bw.svg'
import LogoWB from '../../../public/images/logo_alignair12wb.svg'

interface FooterProps {
  isHomePage?: boolean;
}

export default function Footer({ isHomePage = false }: FooterProps) {
  const context = useTheme();
  const theme = context?.theme || 'dark'; 
  const Logo = theme === 'dark' ? LogoBW : LogoWB;
  
  if (!isHomePage) {
    // Simple footer for non-home pages
    return (
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row items-center justify-between">
              
              {/* Logo and Copyright */}
              <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                <Link href="/" className="inline-block mb-2 md:mb-0 md:mr-4" aria-label="AlignAIR">
                  <Image 
                    className="transition-transform duration-300 hover:scale-105" 
                    src={Logo} 
                    width={40} 
                    height={40} 
                    alt="AlignAIR Logo" 
                  />
                </Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  © {new Date().getFullYear()} AlignAIR. All rights reserved.
                </span>
              </div>

              {/* Links */}
              <div className="flex items-center space-x-6">
                <Link 
                  href="https://github.com/MuteJester/AlignAIR" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                >
                  License
                </Link>
                <Link 
                  href="mailto:alignair@alignair.ai" 
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>

            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Full footer for home page
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12">

            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <Link href="/" className="inline-block group" aria-label="AlignAIR">
                  <Image 
                    className="transition-transform duration-300 group-hover:scale-105" 
                    src={Logo} 
                    width={70} 
                    height={70} 
                    alt="AlignAIR Logo" 
                  />
                </Link>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Advancing Computational Biology
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 max-w-md">
                Revolutionary AI-powered sequence alignment for adaptive immune receptor analysis. 
                Empowering researchers worldwide with precision, speed, and unparalleled accuracy.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <Link 
                  href="https://github.com/MuteJester/AlignAIR" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex justify-center items-center w-11 h-11 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl" 
                  aria-label="GitHub Repository"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Link>
                
                <Link 
                  href="https://pypi.org/project/alignair/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex justify-center items-center w-11 h-11 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl" 
                  aria-label="PyPI Package"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0l1.946 6h6.054l-4.946 3.6 1.946 6-4-2.4-4 2.4 1.946-6-4.946-3.6h6.054z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-8">

              {/* Products & Tools */}
              <div>
                <h4 className="text-gray-900 dark:text-gray-200 font-semibold mb-6 text-sm uppercase tracking-wider">
                  Products & Tools
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="/alignair" 
                      className="group text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      AlignAIR Web Interface
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/cli" 
                      className="group text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      AlignAIR CLI
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="https://pypi.org/project/GenAIRR/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      GenAIRR Simulator
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/models" 
                      className="group text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-indigo-500 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      AI Models
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources & Documentation */}
              <div>
                <h4 className="text-gray-900 dark:text-gray-200 font-semibold mb-6 text-sm uppercase tracking-wider">
                  Documentation
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="/docs" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs/installation" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Installation Guide
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs/examples" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Examples & Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs/api" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      About AlignAIR
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support & Community */}
              <div>
                <h4 className="text-gray-900 dark:text-gray-200 font-semibold mb-6 text-sm uppercase tracking-wider">
                  Support & Legal
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="mailto:support@alignair.ai" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Contact Support
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs/faq" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      FAQ & Help
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="https://github.com/MuteJester/AlignAIR/issues" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Report Issues
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs/terms" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Terms & License
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/privacy" 
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mb-12 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0 lg:mr-8">
                <h3 className="text-white text-xl font-bold mb-2">
                  Stay Updated with AlignAIR
                </h3>
                <p className="text-purple-100 text-base">
                  Get the latest updates, features, and research insights delivered to your inbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[400px]">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between">
              
              {/* Copyright */}
              <div className="flex flex-col md:flex-row items-center text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                <span>© {new Date().getFullYear()} AlignAIR. All rights reserved.</span>
                <span className="hidden md:inline mx-2">•</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  Advancing computational biology through AI
                </span>
              </div>

              {/* Quick Links */}
              <div className="flex items-center space-x-6">
                <Link 
                  href="https://github.com/MuteJester/AlignAIR" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                >
                  Open Source
                </Link>
                <Link 
                  href="/docs/terms" 
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                >
                  License
                </Link>
                <Link 
                  href="mailto:alignair@alignair.ai" 
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
