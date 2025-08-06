import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import ProductCard from "@/components/product-card";
import { useProducts } from "@/lib/products";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Premium", "Gaming", "Studio", "Wireless", "Sport", "Classic"];

  const filteredProducts = products?.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Our <span className="gradient-text">Products</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover our complete range of premium headphones
              </p>
            </motion.div>
            
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full px-6 py-2 transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[var(--sonic-blue)] text-black hover:bg-blue-600"
                      : "border-gray-600 hover:border-[var(--sonic-blue)] hover:text-[var(--sonic-blue)]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </motion.div>
            
            {/* Products Grid */}
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
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))
              )}
            </div>

            {filteredProducts.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-gray-400 text-xl">
                  No products found in the {selectedCategory} category.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
