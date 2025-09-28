import { metadata } from './metadata';
import './css/style.css';
import { Inter, Architects_Daughter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeScript } from '@/components/ui/theme-provider'
import ClientLayout from '@/components/layouts/ClientLayout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import DevNav from '@/components/ui/DevNav'
import { env } from '@/config/env'

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
    <html 
      lang="en" 
      className={`${inter.variable} ${architects_daughter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link rel="icon" href="/icon.ico" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <script src="/onnx/ort.min.js"></script>
      </head>
      <body className="font-inter antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 tracking-tight transition-colors duration-300">
        <DevNav />
        <ErrorBoundary>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ErrorBoundary>
        {env.services.googleAnalytics.enabled && (
          <GoogleAnalytics gaId={env.services.googleAnalytics.id} />
        )}
      </body>
    </html>
  )
}
