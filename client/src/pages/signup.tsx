import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await apiRequest("POST", "/api/auth/signup", signupData);
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Account Created",
          description: "Welcome to SonicWave! You can now sign in.",
        });
        // Redirect to login page
        window.location.href = "/login";
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "An error occurred during signup",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup",
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
                  <h1 className="text-3xl font-bold mb-2">Join SonicWave</h1>
                  <p className="text-gray-400">Create your account to start shopping</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-[var(--sonic-blue)]" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="Create a secure password"
                        minLength={6}
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

                  <div>
                    <Label htmlFor="confirmPassword" className="flex items-center mb-2">
                      <Lock className="h-4 w-4 mr-2 text-[var(--sonic-blue)]" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white pr-10"
                        placeholder="Confirm your password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? (
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login">
                      <a className="text-[var(--sonic-blue)] hover:text-blue-400 font-medium">
                        Sign in here
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