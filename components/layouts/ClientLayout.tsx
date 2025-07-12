"use client";

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/header'
import Banner from '@/components/ui/banner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import DevNav from '@/components/ui/DevNav'

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isDocsPage = pathname?.startsWith('/docs')
  const isDevDocsPage = pathname?.startsWith('/dev-docs')

  return (
    <ThemeProvider>
      {isDocsPage ? (
        // Docs pages: no header/banner, just content
        <>{children}</>
      ) : isDevDocsPage ? (
        // Dev docs pages: no header/banner/dev nav, just content
        <>{children}</>
      ) : (
        // Regular pages: include header, dev nav, and banner
        <div className="flex flex-col min-h-screen overflow-hidden">
          {/* <DevNav /> */}
          <Header />
          {children}
          {/* <Banner /> */}
        </div>
      )}
    </ThemeProvider>
  )
} 