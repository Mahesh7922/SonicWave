import { motion } from "framer-motion";
import { User, Package, Calendar, CreditCard, Edit3, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: string;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: string;
  }[];
}

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const { toast } = useToast();

  // Initialize edit data when user loads
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user]);

  // Fetch user's orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/user"],
    enabled: !!user,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to view your profile",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest("PUT", "/api/auth/profile", editData);
      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        setIsEditing(false);
        // Refresh user data
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-600";
      case "shipped":
        return "bg-blue-600";
      case "processing":
        return "bg-yellow-600";
      case "pending":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--sonic-blue)] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">Please sign in to view your profile</p>
            <Button 
              onClick={() => window.location.href = "/login"}
              className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold rounded-full"
            >
              Sign In
            </Button>
          </div>
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--sonic-blue)] to-[var(--sonic-orange)] rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-gray-400">Manage your account and view your orders</p>
                </div>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-[var(--sonic-blue)] data-[state=active]:text-black">
                    Profile Settings
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="data-[state=active]:bg-[var(--sonic-blue)] data-[state=active]:text-black">
                    Order History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center text-white">
                            <User className="h-5 w-5 mr-2 text-[var(--sonic-blue)]" />
                            Personal Information
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Update your personal details and account information
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-[var(--sonic-blue)] hover:text-blue-400"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName" className="text-white">First Name</Label>
                              <Input
                                id="firstName"
                                value={editData.firstName}
                                onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-white">Last Name</Label>
                              <Input
                                id="lastName"
                                value={editData.lastName}
                                onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-white">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({...editData, email: e.target.value})}
                              className="bg-gray-800 border-gray-700 text-white"
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              type="submit"
                              className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold rounded-full"
                            >
                              Save Changes
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsEditing(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                              <User className="h-5 w-5 text-[var(--sonic-blue)]" />
                              <div>
                                <p className="text-sm text-gray-400">Name</p>
                                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-[var(--sonic-blue)]" />
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white font-medium">{user.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-[var(--sonic-blue)]" />
                            <div>
                              <p className="text-sm text-gray-400">Member Since</p>
                              <p className="text-white font-medium">
                                {new Date().toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Package className="h-5 w-5 mr-2 text-[var(--sonic-blue)]" />
                        Order History
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        View and track your previous orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin w-6 h-6 border-2 border-[var(--sonic-blue)] border-t-transparent rounded-full" />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No orders found</p>
                          <Button 
                            onClick={() => window.location.href = "/products"}
                            className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold rounded-full"
                          >
                            Start Shopping
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gray-800 rounded-lg p-6"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-semibold text-white mb-1">
                                    Order #{order.id.slice(0, 8)}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(order.status)} text-white mb-2`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                  <p className="text-[var(--sonic-orange)] font-bold">
                                    ${parseFloat(order.total).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {order.items && order.items.length > 0 && (
                                <div className="space-y-2 mb-4">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-300">
                                        {item.productName} × {item.quantity}
                                      </span>
                                      <span className="text-gray-400">
                                        ${parseFloat(item.price).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {order.trackingNumber && (
                                <div className="flex items-center text-sm text-[var(--sonic-blue)]">
                                  <Package className="h-4 w-4 mr-2" />
                                  Tracking: {order.trackingNumber}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}