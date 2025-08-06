import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const totalItems = getTotalItems();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div 
              className="text-2xl font-bold gradient-text cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SonicWave
            </motion.div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.a
                  className={`transition-colors duration-300 cursor-pointer ${
                    location === item.href 
                      ? "text-[var(--sonic-blue)]" 
                      : "hover:text-[var(--sonic-blue)]"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.label}
                </motion.a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleCart}
              className="relative p-2 hover:text-[var(--sonic-blue)] transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="h-6 w-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-[var(--sonic-orange)] text-black text-xs rounded-full px-2 py-1 font-semibold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="hidden md:flex items-center space-x-3">
                    <span className="text-sm text-gray-300">
                      Hi, {user?.firstName}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="hover:text-[var(--sonic-blue)]"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center space-x-2">
                    <Link href="/login">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:text-[var(--sonic-blue)]"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button 
                        size="sm"
                        className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold rounded-full"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
            
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`block py-2 transition-colors duration-300 ${
                      location === item.href 
                        ? "text-[var(--sonic-blue)]" 
                        : "hover:text-[var(--sonic-blue)]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              
              {!isLoading && (
                <div className="pt-4 border-t border-gray-700">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300 py-2">
                        Hi, {user?.firstName}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start hover:text-[var(--sonic-blue)]"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start hover:text-[var(--sonic-blue)]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button 
                          size="sm"
                          className="w-full bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold rounded-full"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
