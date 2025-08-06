import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", formData);
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back to SonicWave!",
        });
        // Redirect to home page or dashboard
        window.location.href = "/";
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="min-h-screen flex items-center justify-center py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <Link href="/">
                  <Button variant="ghost" className="hover:text-[var(--sonic-blue)] mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-900 rounded-3xl p-8 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                  <p className="text-gray-400">Sign in to your SonicWave account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-[var(--sonic-blue)]" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center mb-2">
                      <Lock className="h-4 w-4 mr-2 text-[var(--sonic-blue)]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white pr-10"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold py-3 rounded-full transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/signup">
                      <a className="text-[var(--sonic-blue)] hover:text-blue-400 font-medium">
                        Sign up here
                      </a>
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}