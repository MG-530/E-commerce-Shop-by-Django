import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted/50 to-background py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Welcome to the future of e-commerce
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Your Ultimate
            <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Multi-Vendor</span>
            <br />
            Marketplace
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover thousands of products from trusted vendors worldwide. Shop with confidence, manage your business,
            or handle warehouse operations all in one place. Experience the next generation of online shopping.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/products">
              <Button size="lg" className="flex items-center gap-2 px-8 py-4 text-lg">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vendor/register">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Become a Vendor
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
