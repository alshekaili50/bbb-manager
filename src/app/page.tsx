import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBB Manager - Deploy BigBlueButton in Minutes',
  description: 'Enterprise-grade BigBlueButton deployment with automatic scaling, analytics, and 24/7 availability.',
}

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  )
}
