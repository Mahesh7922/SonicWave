import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY. Please add your Stripe publishable key to the environment variables.');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout?success=true',
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 border border-gray-600 rounded-xl bg-gray-800">
        <h4 className="font-semibold mb-4 flex items-center">
          <Lock className="h-5 w-5 text-[var(--sonic-blue)] mr-2" />
          Secure Payment Information
        </h4>
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold py-4 rounded-full transition-all duration-300"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  const { items, getTotalPrice, clearCart, sessionId } = useCartStore();
  const totalPrice = getTotalPrice();

  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get('success') === 'true';

  useEffect(() => {
    if (isSuccess) {
      setCurrentStep(3);
      setOrderNumber((Math.floor(Math.random() * 90000) + 10000).toString());
      clearCart();
    }
  }, [isSuccess, clearCart]);

  useEffect(() => {
    if (currentStep === 2 && !clientSecret && items.length > 0) {
      // Create PaymentIntent when moving to step 2
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: totalPrice, 
        sessionId,
        customerInfo: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}`,
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          console.error('Error creating payment intent:', err);
        });
    }
  }, [currentStep, clientSecret, items.length, totalPrice, sessionId, customerInfo]);

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center py-16">
              <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-gray-400 mb-8">Add some products to your cart before checkout.</p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(3);
    setOrderNumber((Math.floor(Math.random() * 90000) + 10000).toString());
    clearCart();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
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

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                
                {/* Step Indicator */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 1 ? 'bg-[var(--sonic-blue)] text-black' : 'bg-gray-600 text-white'
                    }`}>1</div>
                    <span className="ml-2">Information</span>
                  </div>
                  <div className="w-8 border-t border-gray-600"></div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 2 ? 'bg-[var(--sonic-blue)] text-black' : 'bg-gray-600 text-white'
                    }`}>2</div>
                    <span className="ml-2">Payment</span>
                  </div>
                  <div className="w-8 border-t border-gray-600"></div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                    }`}>3</div>
                    <span className="ml-2">Complete</span>
                  </div>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Step 1: Customer Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900 rounded-3xl p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
                      <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={customerInfo.firstName}
                              onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                              className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={customerInfo.lastName}
                              onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                              className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="address">Shipping Address</Label>
                          <Input
                            id="address"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                            required
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={customerInfo.city}
                              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                              className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={customerInfo.state}
                              onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                              className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={customerInfo.zipCode}
                              onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                              className="bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)]"
                              required
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold py-4 rounded-full transition-all duration-300"
                        >
                          Continue to Payment
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900 rounded-3xl p-8"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Payment Information</h2>
                        <Button
                          variant="ghost"
                          onClick={() => setCurrentStep(1)}
                          className="hover:text-[var(--sonic-blue)]"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </div>
                      
                      {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <CheckoutForm onSuccess={handlePaymentSuccess} />
                        </Elements>
                      ) : (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin w-8 h-8 border-4 border-[var(--sonic-blue)] border-t-transparent rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Success */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900 rounded-3xl p-8 text-center"
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold mb-4 text-green-500">Payment Successful!</h2>
                      <p className="text-gray-300 text-lg mb-6">
                        Thank you for your purchase. Your order has been confirmed and will be shipped within 2-3 business days.
                      </p>
                      
                      <div className="bg-gray-800 rounded-xl p-6 mb-6">
                        <div className="text-sm text-gray-400 mb-2">Order Number</div>
                        <div className="text-2xl font-mono font-bold text-[var(--sonic-blue)]">
                          #SW-2024-{orderNumber}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                          <Button className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold px-8 py-3 rounded-full">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Order Summary */}
                {currentStep < 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900 rounded-3xl p-8 h-fit"
                  >
                    <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-[var(--sonic-blue)]">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
