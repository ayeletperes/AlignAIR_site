'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/ui/theme-provider';
import LogoBW from '@/public/images/logo_alignair11bw.svg';
import LogoWB from '@/public/images/logo_alignair11wb.svg';

// Search data structure
interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: string;
  keywords: string[];
}

// Search data - this would ideally come from a CMS or be generated from markdown files
const searchData: SearchItem[] = [
  {
    title: 'Installation Guide',
    description: 'Step-by-step guide to install AlignAIR using Docker or build from source',
    href: '/docs/installation',
    category: 'Installation',
    keywords: ['install', 'setup', 'docker', 'build', 'source', 'requirements']
  },
  {
    title: 'Usage Guide',
    description: 'Learn how to run AlignAIR with different parameters and configure thresholds',
    href: '/docs/usage',
    category: 'Usage',
    keywords: ['usage', 'parameters', 'thresholds', 'configuration', 'run', 'execute']
  },
  {
    title: 'Examples',
    description: 'Real-world examples with sample data, commands, and expected outputs',
    href: '/docs/examples',
    category: 'Examples',
    keywords: ['examples', 'sample', 'tutorial', 'demo', 'workflow']
  },
  {
    title: 'API Reference',
    description: 'Complete parameter reference and API documentation',
    href: '/docs/api',
    category: 'API',
    keywords: ['api', 'reference', 'parameters', 'endpoints', 'documentation']
  },
  {
    title: 'Technical Details',
    description: 'Deep dive into algorithms, neural network architecture, and training pipeline',
    href: '/docs/technical',
    category: 'Technical',
    keywords: ['technical', 'algorithms', 'neural network', 'architecture', 'training']
  },
  {
    title: 'Architecture',
    description: 'Detailed overview of AlignAIR\'s neural network architecture',
    href: '/docs/technical/architecture',
    category: 'Technical',
    keywords: ['architecture', 'neural network', 'model', 'design', 'structure']
  },
  {
    title: 'Thresholding Logic',
    description: 'Understanding how AlignAIR applies thresholds for allele selection',
    href: '/docs/technical/thresholding',
    category: 'Technical',
    keywords: ['thresholding', 'thresholds', 'allele', 'selection', 'logic']
  },
  {
    title: 'Mutation Handling',
    description: 'How AlignAIR handles mutations and sequence variations',
    href: '/docs/technical/mutations',
    category: 'Technical',
    keywords: ['mutations', 'variations', 'sequence', 'handling', 'processing']
  },
  {
    title: 'FAQ & Help',
    description: 'Common questions, troubleshooting guides, and community support',
    href: '/docs/faq',
    category: 'Help',
    keywords: ['faq', 'help', 'troubleshooting', 'support', 'questions']
  },
  {
    title: 'Terms & License',
    description: 'Legal information, terms of use, and licensing details',
    href: '/docs/terms',
    category: 'Legal',
    keywords: ['terms', 'license', 'legal', 'privacy', 'policy']
  }
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const context = useTheme();
  const theme = context?.theme || 'dark';
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchData.filter(item => {
      const searchableText = [
        item.title.toLowerCase(),
        item.description.toLowerCase(),
        item.category.toLowerCase(),
        ...item.keywords.map(k => k.toLowerCase())
      ].join(' ');
      
      return searchableText.includes(lowerQuery);
    });

    setSearchResults(results);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
    setIsSearchOpen(true);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Keyboard shortcut to focus search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search docs..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const links = [
    {
      name: 'Installation',
      href: '/docs/installation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      description: 'Get started quickly'
    },
    {
      name: 'Usage',
      href: '/docs/usage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Learn the basics'
    },
    {
      name: 'Examples',
      href: '/docs/examples',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Real-world examples'
    },
    {
      name: 'Technical Details',
      href: '/docs/technical',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      description: 'Deep dive into algorithms',
      children: [
        { name: 'Architecture', href: '/docs/technical/architecture', icon: '🧠' },
        { name: 'Thresholding Logic', href: '/docs/technical/thresholding', icon: '🎚️' },
        { name: 'Mutation Handling', href: '/docs/technical/mutations', icon: '🧬' },
      ],
    },
    {
      name: 'API Reference',
      href: '/docs/api',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      description: 'Complete parameter reference'
    },
    {
      name: 'FAQ & Help',
      href: '/docs/faq',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Get help quickly'
    },
    {
      name: 'Terms & License',
      href: '/docs/terms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: 'Legal information'
    },
  ];

  // Utility to check if a section should be expanded
  const isActiveOrChild = (parentHref: string, children: { href: string }[] = []) => {
    return pathname === parentHref || children.some((child) => pathname.startsWith(child.href));
  };

  // Get current page info for breadcrumb
  const getCurrentPageInfo = () => {
    for (const link of links) {
      if (pathname === link.href) {
        return { parent: link.name, current: null };
      }
      if (link.children) {
        for (const child of link.children) {
          if (pathname === child.href) {
            return { parent: link.name, current: child.name };
          }
        }
      }
    }
    return { parent: 'Documentation', current: null };
  };

  // Get navigation info for footer
  const getNavigationInfo = () => {
    const allPages: { name: string; href: string }[] = [];
    
    // Flatten all pages into a single array
    links.forEach(link => {
      allPages.push({ name: link.name, href: link.href });
      if (link.children) {
        link.children.forEach(child => {
          allPages.push({ name: child.name, href: child.href });
        });
      }
    });

    const currentIndex = allPages.findIndex(page => page.href === pathname);
    
    return {
      previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
      next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
      current: currentIndex >= 0 ? allPages[currentIndex] : null
    };
  };

  const pageInfo = getCurrentPageInfo();
  const navigation = getNavigationInfo();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      {/* Minimal Docs Toolbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="AlignAIR Home">
            <Image 
              src={theme === 'dark' ? LogoBW : LogoWB}
              // width={120} 
              // height={30} 
              alt="AlignAIR Logo" 
              priority
              className="transition-opacity"
              style={{ width: 120, height: 30 }}
            />
          </Link>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Docs Label */}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentation</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Quick nav back to main site */}
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/alignair"
            className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md transition-colors"
          >
            Try AlignAIR
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Main docs layout */}
      <div className="flex">

      {/* Enhanced Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800 relative">

        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AlignAIR Docs</h2>
              <p className="text-sm text-gray-400">Complete documentation</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-10 pr-20 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
            />
            
            {/* Keyboard Shortcut Indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700 border border-gray-600 rounded">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
              </kbd>
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  {searchResults.map((result, index) => (
                    <Link
                      key={result.href}
                      href={result.href}
                      className="block p-3 rounded-lg hover:bg-gray-700 transition-colors group"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                            {result.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {result.description}
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                              {result.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results Message */}
            {isSearchOpen && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 text-center">
                  <div className="text-gray-400 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Try different keywords or check the navigation menu
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2 overflow-y-auto flex-1">
          {links.map((link, index) => {
            const expanded = isActiveOrChild(link.href, link.children || []);
            const isActive = pathname === link.href;

            return (
              <div key={link.href} className="group">
                <Link
                  href={link.href}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'hover:bg-gray-800 hover:text-white text-gray-300'
                  }`}
                >
                  <div className={`mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{link.name}</div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-purple-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      {link.description}
                    </div>
                  </div>
                  {link.children && (
                    <div className={`ml-2 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Submenu */}
                {link.children && expanded && (
                  <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {link.children.map((child, childIndex) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          pathname === child.href

                            ? 'text-purple-400 bg-gray-800 border-l-2 border-purple-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <span className="mr-3 text-sm">{child.icon}</span>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Need Help?</h3>
                <p className="text-xs text-blue-200 mb-2">Check our FAQ or get support</p>
                <div className="flex space-x-2">
                  <Link href="/docs/faq" className="text-xs text-blue-300 hover:text-blue-200 underline">
                    FAQ
                  </Link>
                  <span className="text-blue-400">•</span>
                  <a href="https://github.com/MuteJester/AlignAIR" className="text-xs text-blue-300 hover:text-blue-200 underline">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Enhanced Breadcrumb */}
        <div className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {pageInfo.current ? (
              <>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  {pageInfo.parent}
                </Link>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">{pageInfo.current}</span>
              </>
            ) : (
              <span className="text-white font-medium">{pageInfo.parent}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-none pb-8">
            {children}
          </div>
        </div>

        {/* Enhanced Footer Navigation */}
        <div className="bg-gray-900 border-t border-gray-800 px-8 py-6">
          <div className="flex justify-between items-center">

            {/* Previous Page */}
            <div className="flex-1">
              {navigation.previous ? (
                <Link href={navigation.previous.href} className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Previous</div>
                    <div className="font-medium">{navigation.previous.name}</div>
                  </div>
                </Link>
              ) : (
                <Link href="/docs" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Back to</div>
                    <div className="font-medium">Docs Home</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Center - Page Actions */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/MuteJester/AlignAIR" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Star on GitHub
              </a>
              <a 
                href="https://github.com/MuteJester/AlignAIR/issues" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report Issue
              </a>
            </div>

            {/* Next Page */}
            <div className="flex-1 flex justify-end">
              {navigation.next ? (
                <Link href={navigation.next.href} className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Next</div>
                    <div className="font-medium">{navigation.next.name}</div>
                  </div>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href="/alignair" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Try now</div>
                    <div className="font-medium">AlignAIR Tool</div>
                  </div>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="bg-black border-t border-gray-800 px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© 2025 AlignAIR. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span>Advancing computational biology through AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/docs/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/docs/license" className="hover:text-gray-300 transition-colors">
                License
              </Link>
              <span>•</span>
              <a 
                href="https://github.com/MuteJester/AlignAIR" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                Open Source
              </a>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}