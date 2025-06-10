'use client';

import Image from 'next/image'
import Link from 'next/link'
import LandingImg01 from '@/public/images/landing_page.jpg'
import Starfield from '../ui/animatedStarfield';
import { useTheme } from '../ui/theme-provider';

import React, { useRef, useEffect, useState } from 'react';

export default function Hero() {
  const context = useTheme();
  const theme = context?.theme || 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionSize, setSectionSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (sectionRef.current) {
      setSectionSize({
        width: sectionRef.current.clientWidth,
        height: sectionRef.current.clientHeight
      });
    }
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full" ref={sectionRef}>
        
        {/* Animated Starfield Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Starfield
            starCount={300}
            speedFactor={0.05}
            sectionW={sectionSize.width}
            sectionH={sectionSize.height}
          />
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-600/20 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-600/20 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/5 dark:via-gray-100/5 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center py-20 lg:py-32">
          
          {/* Badge */}
          <div className="inline-flex items-center rounded-full px-4 py-2 mb-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800/50" data-aos="fade-up">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Advanced AI-Powered Sequence Alignment
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" data-aos="fade-up" data-aos-delay="100">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Align
            </span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AIR
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Revolutionary deep learning for <span className="font-semibold text-purple-600 dark:text-purple-400">BCR and TCR</span> sequence alignment
          </p>

          {/* Description */}
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="300">
            Fast, accurate analysis of immune receptor repertoire sequences with unparalleled precision and speed
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16" data-aos="fade-up" data-aos-delay="400">
            <Link
              href="/alignair"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Try AlignAIR Now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center px-8 py-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation
            </Link>

            <Link
              href="https://github.com/MuteJester/AlignAIR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Link>
          </div>

          {/* Stats/Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="600">
            
            {/* Accuracy */}
            <div className="group p-6 rounded-2xl bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">High Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Superior performance in allele classification and sequence alignment</p>
            </div>

            {/* Speed */}
            <div className="group p-6 rounded-2xl bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Rapid processing with optimized deep learning algorithms</p>
            </div>

            {/* Versatility */}
            <div className="group p-6 rounded-2xl bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multi-Platform</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Web interface, CLI tools, and comprehensive API access</p>
            </div>
          </div>

          {/* Trusted by section */}
          <div className="mt-16 pt-8 border-t border-gray-200/20 dark:border-gray-700/30" data-aos="fade-up" data-aos-delay="800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Advancing computational biology research worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-gray-400 dark:text-gray-500 font-semibold">🧬 BCR Annotation</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">🔬 TRB Annotation</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">⚡ Deep Learning</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">📊 Research Tools</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
