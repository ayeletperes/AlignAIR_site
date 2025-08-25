'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import AOS from 'aos'
import 'aos/dist/aos.css'

import PageIllustration from '@components/layouts/page-illustration'
import Footer from '@components/ui/footer'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  const pathname = usePathname()
  const isHome = pathname?.endsWith('/')

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 600,
      easing: 'ease-out-sine',
    })
  })

  return (
    <>
      <main className="grow">

        <PageIllustration />

        {children}

      </main>

      {/* Only show footer for non-docs pages */}
      <Footer isHomePage={isHome}/>
    </>
  )
}
