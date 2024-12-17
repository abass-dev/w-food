import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import FeaturedDishes from '@/components/FeaturedDishes'
import TestimonialSection from '@/components/TestimonialSection'
import NewsletterSignup from '@/components/NewsletterSignup'
import { AnimatedTitle, AnimatedExperienceSection } from '@/components/AnimatedSections'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 md:py-24">
          <AnimatedTitle>Discover Our Culinary Delights</AnimatedTitle>
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
            <FeaturedDishes />
          </Suspense>
        </section>

        <TestimonialSection />

        <AnimatedExperienceSection />

        <NewsletterSignup />
      </main>
    </div>
  )
}

