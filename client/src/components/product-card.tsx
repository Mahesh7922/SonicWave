import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="product-card bg-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 transform cursor-pointer">
          <div className="relative overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="product-image w-full h-64 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 right-4">
              <Badge className={`${getCategoryColor(product.category)} text-sm font-semibold`}>
                {product.category}
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-[var(--sonic-blue)]">
                ${product.price}
              </span>
              
              <Button
                onClick={handleAddToCart}
                className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
