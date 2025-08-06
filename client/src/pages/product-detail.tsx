import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import { useProduct } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Premium: "bg-[var(--sonic-orange)] text-black",
      Gaming: "bg-green-500 text-white",
      Studio: "bg-purple-500 text-white",
      Wireless: "bg-[var(--sonic-blue)] text-black",
      Sport: "bg-red-500 text-white",
      Classic: "bg-yellow-500 text-black",
    };
    return colors[category] || "bg-gray-500 text-white";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Skeleton className="w-full h-96 rounded-3xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/products">
                <Button variant="ghost" className="hover:text-[var(--sonic-blue)]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
                <div className="absolute top-6 right-6">
                  <Badge className={`${getCategoryColor(product.category)} text-sm font-semibold`}>
                    {product.category}
                  </Badge>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4">
                    {product.name}
                  </h1>
                  <p className="text-3xl font-bold text-[var(--sonic-blue)] mb-6">
                    ${product.price}
                  </p>
                </div>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border-gray-600 hover:border-[var(--sonic-blue)] hover:text-[var(--sonic-blue)]"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-12 text-center text-xl font-semibold">
                        {quantity}
                      </span>
                      
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border-gray-600 hover:border-[var(--sonic-blue)] hover:text-[var(--sonic-blue)]"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="flex-1 bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Product Features</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Premium audio drivers for exceptional sound quality</li>
                    <li>• Comfortable over-ear design for extended use</li>
                    <li>• Durable construction with premium materials</li>
                    <li>• Compatible with all audio devices</li>
                    <li>• 2-year warranty included</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
