import React from "react"
import Link from 'next/link'
import MobileMenu from './mobile-menu'
import ThemeToggle from './theme-toggle'
import Image from 'next/image'
import { useTheme } from './theme-provider';
import LogoBW from '@/public/images/logo_alignair11bw.svg'
import LogoWB from '@/public/images/logo_alignair11wb.svg'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

// The header component. TODO: add the logo and the navigation links.

export default function Header() {
  const context = useTheme();
  const theme = context?.theme || 'dark'; 
  return (
    <header className="absolute w-full z-30 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo - Clean conditional approach inspired by picture element */}
            <Link href="/" className="block" aria-label="AlignAIR">
              <Image 
                src={theme === 'dark' ? LogoBW : LogoWB}
                width={200} 
                height={50} 
                alt="AlignAIR Logo" 
                priority
                className="transition-opacity"
              />
            </Link>
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/about"
                  className="font-medium text-purple-600 hover:text-gray-500 dark:hover:text-gray-200 px-4 py-3 flex items-center transition-all duration-300 ease-in-out"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="btn-sm text-purple-600 hover:text-gray-500 dark:hover:text-gray-200 px-4 py-3 flex items-center transition-all duration-300 ease-in-out"
                >
                  Docs
                </Link>
              </li>
              <li>
                {/* <Link href="/alignair" className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3">
                  AlignAIR
                </Link> */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3 transition-all duration-300">
                      AlignAIR
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdown-theme">
                    <DropdownItem key="web" className="custom-dropdown-text">
                      <Link href="/alignair">
                        AlignAIR Web
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="docs" className="custom-dropdown-text">
                      <Link href="/docs">
                        AlignAIR Docs
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="cli" className="custom-dropdown-text">
                      <Link href="/cli">
                        AlignAIR CLI
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="yaml" className="custom-dropdown-text">
                      <Link href="/yaml">
                        Generate CLI yaml
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
              <li className="ml-3">
                <ThemeToggle />
              </li>
            </ul>
          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
