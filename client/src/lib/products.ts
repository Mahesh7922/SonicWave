import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });
}
