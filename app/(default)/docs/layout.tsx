'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: 'Installation', href: '/docs/installation' },
    { name: 'Usage', href: '/docs/usage' },
    //{ name: 'Examples', href: '/docs/examples' },
    //{ name: 'Advanced Topics', href: '/docs/advanced' },
    {
      name: 'Technical Details',
      href: '/docs/technical',
      children: [
        { name: 'Architecture', href: '/docs/technical/architecture' },
        { name: 'Thresholding Logic', href: '/docs/technical/thresholding' },
        { name: 'Mutation Handling', href: '/docs/technical/mutations' },
      ],
    },
  ];

  // Utility to check if a section should be expanded
  const isActiveOrChild = (parentHref: string, children: { href: string }[] = []) => {
    return pathname === parentHref || children.some((child) => pathname.startsWith(child.href));
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex">

      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-gray-800 bg-black">
        <h2 className="text-2xl font-bold mb-8 text-white">Docs</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => {
            const expanded = isActiveOrChild(link.href, link.children || []);

            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>

                {link.children && expanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block text-sm px-3 py-1 rounded-md ${
                          pathname === child.href
                            ? 'text-purple-400 bg-gray-800'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
