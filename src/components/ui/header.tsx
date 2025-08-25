'use client'

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import MobileMenu from './mobile-menu'
import ThemeToggle from './theme-toggle'
import Image from 'next/image'
import { useTheme } from './theme-provider';
import { env } from '@/config/env';
import LogoBW from '../../../public/images/logo_alignair11bw.svg'
import LogoWB from '../../../public/images/logo_alignair11wb.svg'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

// The header component with updated navigation including Models page

export default function Header() {
  const context = useTheme();
  const theme = context?.theme || 'dark'; 
  const isDevelopment = env.isDevelopment;


  return (
    <header className={`w-full z-50 transition-all duration-300 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="AlignAIR">
              <Image 
                src={theme === 'dark' ? LogoBW : LogoWB}
                // width={180} 
                // height={45}
                style={{ width: 180, height: 45 }} 
                alt="AlignAIR Logo" 
                priority
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <Link
                href="/about"
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                About
              </Link>
              
              <Link
                href="/docs"
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Documentation
              </Link>

              <Link
                href="/models"
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Models
              </Link>

              {/* Tools Dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="ghost" 
                    className="px-4 py-2 h-auto rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-800"
                  >
                    Tools
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Tools"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-[200px]"
                >
                  <DropdownItem key="web" textValue="AlignAIR Web" className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3">
                    <Link href="/alignair" className="flex items-center w-full">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">AlignAIR Web</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Browser-based interface</div>
                      </div>
                    </Link>
                  </DropdownItem>
                  
                  <DropdownItem key="cli" textValue="AlignAIR CLI" className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3">
                    <Link href="/cli" className="flex items-center w-full">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">AlignAIR CLI</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Command line tool</div>
                      </div>
                    </Link>
                  </DropdownItem>
                  
                  <DropdownItem key="yaml" textValue="YAML Generator" className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3">
                    <Link href="/yaml" className="flex items-center w-full">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">YAML Generator</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Generate CLI config</div>
                      </div>
                    </Link>
                  </DropdownItem>
                  
                  <DropdownItem key="allele-query" textValue="Allele Query" className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3">
                      <Link href="/tools/allele-query" className="flex items-center w-full">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg mr-3">
                        <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Allele Query</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Search allele database</div>
                      </div>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-6">
            {/* <Link
                href="/alignair"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try AlignAIR
              </Link> */}
              
              <ThemeToggle />
              
              <Link
                href={env.services.github.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Link>
              

            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}