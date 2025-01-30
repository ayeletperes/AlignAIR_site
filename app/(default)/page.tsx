export const metadata = {
  title: 'Home',
  description: 'Landing page',
}

import Hero from '@/components/layouts/hero'
import Features from '@components/pages/features'
import Newsletter from '@/components/layouts/newsletter'
import Zigzag from '@/components/layouts/zigzag'
//import Testimonials from '@/components/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <Newsletter />
      {/* <Testimonials />
      <Newsletter /> */}
    </>
  )
}
