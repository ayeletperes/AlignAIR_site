'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  const pageInfo = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-black text-gray-200 flex">

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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
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
          <div className="max-w-none">
            {children}
          </div>
        </div>

        {/* Enhanced Footer Navigation */}
        <div className="bg-gray-900 border-t border-gray-800 px-8 py-6">
          <div className="flex justify-between items-center">

            {/* Previous Page */}
            <div className="flex-1">
              {/* You could add logic here to determine previous page */}
              <Link href="/docs" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Docs Home
              </Link>
            </div>

            {/* Center - Page Actions */}
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md text-sm transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Star on GitHub
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Edit Page
              </button>
            </div>

            {/* Next Page */}
            <div className="flex-1 flex justify-end">
              {/* You could add logic here to determine next page */}
              <Link href="/docs/installation" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                Get Started
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}