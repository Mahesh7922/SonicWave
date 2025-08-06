import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import ProductCard from "@/components/product-card";
import { useFeaturedProducts } from "@/lib/products";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      
      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Featured <span className="gradient-text">Collection</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Handcrafted headphones designed for every listening experience
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-3xl" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-32 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts?.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      <Footer />
      <CartSidebar />
    </div>
  );
}
