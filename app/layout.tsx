"use client";
import { metadata } from './metadata';

import './css/style.css'

import { Inter, Architects_Daughter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'

import Head from 'next/head'

import Header from '@/components/ui/header'
import Banner from '@/components/ui/banner'
import { ThemeProvider } from '@/components/ui/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const architects_daughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
  display: 'swap'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/icon.ico" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent flash of wrong theme
              (function() {
                var theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add('preload');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                // Remove preload class after a brief moment
                setTimeout(function() {
                  document.documentElement.classList.remove('preload');
                }, 100);
              })();
            `,
          }}
        />
      </Head>
      <body className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 tracking-tight transition-colors duration-300`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            {children}
            <Banner />
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-W94F4SGX8B" />
    </html>
  )
}
 