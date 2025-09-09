import { Navigation } from "@/components/navigation"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { StatsSection } from "@/components/stats-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedProducts />
        <CategoriesSection />
        <NewsletterSection />
      </main>
    </div>
  )
}
